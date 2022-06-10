function fetcher(url: string, header: Headers) {
  return fetch(url, {
    headers: header,
  }).then((response) => response.json());
}

export default fetcher;
