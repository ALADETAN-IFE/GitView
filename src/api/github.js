import axios from "axios";

export const searchUsers = async (query, page) => {
    if (!query || query?.trim() === "") return [];
    try {
        // const response = await axios.get(`https://api.github.com/search/users?q=${query}&per_page=10&page=${page}`)
        const safePage = Math.max(1, Number(page) || 1);
        const params = { q: query, per_page: 10, page: safePage };
        const response = await axios.get('https://api.github.com/search/users', { params });
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

export const dynamicFunc = async (method, link) => {
    try {
        const response = await axios[method](link)
        return response.data
    } catch (error) {
        console.log("Error fetching repos:", error);
        throw error.response.data;
    }
}