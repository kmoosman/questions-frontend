import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";

const API_ENDPOINTS = {
  BASE_URL: "https://api.questions.medtechstack.com/api/",
  // BASE_URL: "http://localhost:3001/api/",
};

export function useGetQuestions() {
  const fetchQuestions = async () => {
    try {
      const endpoint = `questions`;
      return getAPI({ endpoint });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return useQuery(["questions"], fetchQuestions);
}

export function useGetCollection(id) {
  const fetchCollections = async () => {
    try {
      const endpoint = `questions/${id}`;
      return getAPI({ endpoint });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return useQuery(["collections"], fetchCollections);
}

async function getAPI({ endpoint }) {
  const headers = {
    "Content-Type": "application/json",
  };
  return axios
    .get(`${API_ENDPOINTS.BASE_URL}${endpoint}`, {
      headers,
      withCredentials: true,
    })
    .then((response) => response.data);
}

export async function useAddCollectionPOST(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  return axios
    .post(`${API_ENDPOINTS.BASE_URL}questions/create`, data, {
      headers,
      withCredentials: true,
    })
    .then((response) => response.data);
}
