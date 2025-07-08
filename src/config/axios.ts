import axios from "axios"

export const defaultProcessor = axios.create({
  baseURL: "",
})
export const fallbackProcessor = axios.create({
  baseURL: "",
})
