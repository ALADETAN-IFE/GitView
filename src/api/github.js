import axios from "axios";

export const searchUsers = async (query, page) => {
    console.log("Searching for users with query:", query, "on page:", page);
    if (!query || query?.trim() === "") return [];
    try {
        const response = await axios.get(`https://api.github.com/search/users?q=${query}&per_page=10&page=${page}`)
        return response.data
    } catch (error) {
        console.log("Error fetching users:", error.response.data);
        throw error.response.data;
    }
}

export const getUser = async (username) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`)
        return response.data
    } catch (error) {
        console.log("Error fetching user:", error);
        throw error.response.data;
    }
}

export const getRepos = async (username) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`)
        return response.data
    } catch (error) {
        console.log("Error fetching repos:", error);
        throw error.response.data;
    }
}