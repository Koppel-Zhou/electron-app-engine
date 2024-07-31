type Handlers = {
    [key: string]: Function
}

type Callbacks = {
    [key: string]: Function
}

type Target = string | number | Array<string | number>;

type RequestBody = {
    method: string,
    params: any,
    target: number | string,
    id: number | string,
    req_id: string,
    req_timestamp: number
}

type ResponseBody = {
    result: any,
    error: any,
    target: number | string,
    id: number | string,
    req_id: string,
    req_timestamp: number,
    res_timestamp: number,
}