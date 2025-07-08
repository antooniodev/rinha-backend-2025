import axios from "axios"

export const defaultProcessor = axios.create({
  baseURL: process.env.PAYMENT_PROCESSOR_URL_DEFAULT || "",
})
export const fallbackProcessor = axios.create({
  baseURL: process.env.PAYMENT_PROCESSOR_URL_FALLBACK || "",
})
