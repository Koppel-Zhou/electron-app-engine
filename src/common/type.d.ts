type Handlers = {
    [key: string]: Function
}

type Callbacks = {
    [key: string]: Function
}

type RegisterOptions = {
    repeater?: string
}

type Target = string | number | Array<string | number>;

type RequestBody = { method: string, params: Object, target: Target, req_timestamp: number }

type ProtocolRequest = {
    method: string,
    params: any,
    target: number | string,
    from: number | string,
    req_id: string,
    req_timestamp: number
}

type ProtocolResponse = {
    result: any,
    error: any,
    target: number | string,
    from: number | string,
    req_id: string,
    req_timestamp: number,
    res_timestamp: number,
}
