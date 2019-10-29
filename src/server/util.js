/* @flow */
export const isJS = (file: string): boolean => /\.js(\?[^.]+)?$/.test(file)

export const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file)
/**创建承若回调函数 */
export function createPromiseCallback () 
{
  let resolve, reject
  const promise: Promise<string> = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  const cb = (err: Error, res?: string) => 
  {
    if (err) 
    {
      return reject(err)
    }
    resolve(res || '')
  }
  return { promise, cb }
}
