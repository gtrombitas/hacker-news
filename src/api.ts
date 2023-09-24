import axios from 'axios';
import { Item } from './dataTypes';

const BASE_API_URL = 'https://hacker-news.firebaseio.com/v0/';

export function getTopStoryIds() {
    return axios.get<number[]>(`${BASE_API_URL}/topstories.json`);
}

export function getStoryById(id: number) {
    return axios.get<Item>(`${BASE_API_URL}/item/${id}.json`);
}

export async function getTopStories() {
    const topStoryIds = await getTopStoryIds();
    const topStoryRequests = await Promise.all(topStoryIds.data.map(storyId => getStoryById(storyId)));
    return topStoryRequests.map(request => request.data);
}