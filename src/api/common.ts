export interface PageRequest {
	page: number
	pageSize: number
	keyword?: string
	fullQuery?: boolean
}

export interface PageResponse {
	total: number
	page: number
	pageSize: number
	totalPage: number
}
