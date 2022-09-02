import { CARDS_URL } from "../config";

function findAll() {
  return fetch(`${CARDS_URL}/?populate=*`, {
    method: "GET",
    headers: {
      Accept: "Application/json",
    },
  }).then((res) => res.json());
}

function findOne(id) {
  return fetch(`${CARDS_URL}/${id}?populate=*`).then((res) => res.json());
}

export default {
  findAll,
  findOne,
};
