/**
 * Created by macdja38 on 2016-11-27.
 */

/**
 * Created by meew0 on 2015-011-27.
 */
"use strict";

let youtubeDl = require('youtube-dl');
let ytdl = require('ytdl-core');

// formats in order of preference when streaming them
// starting numbers are itag values for youtube https://en.wikipedia.org/wiki/YouTube#Quality_and_formats
let idealFormatIds = ["249", "250", "251", "171", "140", "141", "127", "128", "82", "83", "100", "84", "85", "5", "18", "43", "22", "36", "17", "http_mp3_128_url"];

export function getVideoInfo(link) {
  if (link.indexOf("youtu") > -1) {
    return fetchWithYtdl(link).catch(() => fetchWithYoutubeDl(link));
  } else {
    return fetchWithYoutubeDl(link);
  }
}

export function fetchWithYtdl(link) {
  return new Promise((resolve, reject)=> {
    ytdl.getInfo(link, [], (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    })
  });
}

export function fetchWithYoutubeDl(link) {
  return new Promise((resolve, reject)=> {
    youtubeDl.getInfo(link, [], {maxBuffer: 1000 * 1024}, (err, info) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(info);
      }
    });
  })
}

function getEncoding(info) {
  return info.encoding || info.audioEncoding || info.acodec;
}

function getContainer(info) {
  return info.ext || info.container;
}

function getFormatId(info) {
  return info.itag || info.format_id;
}

function isEncodedAs(info, encoding) {
  return getEncoding(info) === encoding;
}

function isContainer(info, container) {
  return getContainer(info) === container;
}

export function getStreamUrl(info) {
  // first round, extract anything with opus and feed that through.
  let streamableSource = {};
  let formats = info.formats;
  streamableSource.sourceURL = info.webpage_url || info.loaderUrl;
  // try and just use itag values
  let formatMap = formats.map(f => getFormatId(f));
  for (let itag of idealFormatIds) {
    if (formatMap.indexOf(itag) > -1) {
      console.log("found based on itag");
      let format = formats[formatMap.indexOf(itag)];
      streamableSource.encoding = getEncoding(format);
      streamableSource.container = getContainer(format);
      streamableSource.url = format.url;
      return streamableSource;
    }
  }

  let opusItems = info.formats
    .filter(f => isEncodedAs(f, "opus"));
  let webMOpusItems = opusItems.filter(f => isContainer(f, "webm"));
  if (webMOpusItems.length > 0) {
    streamableSource.encoding = "opus";
    streamableSource.container = "webm";
    let sortedwebMOpusItems = webMOpusItems.sort((a, b) => (b.abr || b.audioBitrate) - (a.abr || a.audioBitrate));
    streamableSource.url = sortedwebMOpusItems[0].url;
    console.log("Found webm/opus");
    if (this.raven) {
      process.nextTick(() => {
        let formats = toObj(info.formats);
        formats.chosen = streamableSource;
      });
    }
    return streamableSource;
  }

  // let oggItems = opusItems.filter(f => isContainer(f, "ogg"));

  // second round, capture anything with a bitrate and no resolution
  formats = info.formats
    .sort((a, b) => b.abr - a.abr);
  if (formats.length > 0) {
    let format = (formats.find(f => (f.abr || f.audioBitrate) > 0 && !f.resolution) || formats.find(f => (f.abr || f.audioBitrate) > 0));
    if (format) {
      streamableSource.url = format.url;
      streamableSource.container = getContainer(format);
      streamableSource.encoding = getEncoding(format);
      console.log("defaulted to other ", streamableSource.container, streamableSource.encoding);
      if (this.raven) {
        process.nextTick(() => {
          let formats = toObj(info.formats);
          formats.chosen = streamableSource;
        });
      }
      return streamableSource;
    }


    // 3rd round, extract mp3's and return those.
    format = formats.find(f => isContainer(f, "mp3"));
    if (format) {
      streamableSource.url = format.url;
      streamableSource.container = getContainer(format);
      streamableSource.encoding = getEncoding(format);
      console.log("defaulted to other ", streamableSource.container, streamableSource.encoding);
      if (this.raven) {
        process.nextTick(() => {
          let formats = toObj(info.formats);
          formats.chosen = streamableSource;
        });
      }
      return streamableSource;
    }
  }
  if (this.raven) {
    this.raven.captureException("Could not find a format to queue", {
      extra: toObj(info.formats),
      level: "error"
    });
  }
  return null;
}

function toObj(arr) {
  return arr.reduce(function (o, v, i) {
    o[i] = v;
    return o;
  }, {});
}

export default {
  getVideoInfo,
  getStreamUrl
};