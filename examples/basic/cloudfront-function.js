// AWS CloudFront Function (viewer request) for a sitelo site in a private S3
// bucket. CloudFront maps only "/" to index.html, so this rewrites the clean
// URLs sitelo emits: /about and /about/ both fetch /about/index.html.
function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.endsWith('/')) {
    request.uri += 'index.html'
  } else if (uri.slice(uri.lastIndexOf('/') + 1).indexOf('.') === -1) {
    request.uri += '/index.html'
  }

  return request
}
