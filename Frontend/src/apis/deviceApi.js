import axios from 'axios'
import { BASE_URL } from '../util/constant'

export const subscribeGreenhouseData = (greenhouseId, onMessage, onError) => {
    const eventSource = new EventSource(`${BASE_URL}/sse/data?greenhouse=${greenhouseId}`)

    eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        onMessage(parsedData) // Gọi callback để cập nhật dữ liệu
    }

    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        eventSource.close()
        onError?.(error)
    }

    return eventSource // Trả về EventSource để có thể đóng kết nối khi cần
}