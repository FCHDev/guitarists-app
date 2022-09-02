function findAll() {
  return fetch("http://localhost:1337/api/guitarists/?populate=*", {
    method: "GET",
    headers: {
      Accept: "Application/json",
    },
  }).then((res) => res.json());
}

export default {
  findAll,
};
