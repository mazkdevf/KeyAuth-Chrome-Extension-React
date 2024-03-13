export async function loginPost(
  username: string,
  password: string,
  sessionId: string,
  appName: string,
  ownerId: string,
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const post_data = {
        type: 'login',
        username,
        pass: password,
        sessionid: sessionId,
        name: appName,
        ownerid: ownerId,
      }

      const response = await fetch(
        'https://keyauth.win/api/1.2/?' + new URLSearchParams(post_data).toString(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}
