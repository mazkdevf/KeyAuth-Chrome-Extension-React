export async function upgradePost(username: string, key: string, sessionid: string, name: string, ownerid: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const post_data = {
        type: 'upgrade',
        username,
        key,
        sessionid,
        name,
        ownerid
      };

      const response = await fetch('https://keyauth.win/api/1.2/?' + new URLSearchParams(post_data).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
