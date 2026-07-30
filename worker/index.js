const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || !['GET', 'HEAD'].includes(request.method)) {
      return response
    }

    const url = new URL(request.url)
    const pathname = url.pathname.endsWith('/')
      ? `${url.pathname}index.html`
      : `${url.pathname}.html`

    return env.ASSETS.fetch(new Request(new URL(pathname, url), request))
  },
}

export default worker
