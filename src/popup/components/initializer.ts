// initializer.ts

export async function initialize(ver: string, name: string, ownerid: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const post_data = {
        type: 'init',
        ver,
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

// Example usage:
// import { initialize } from './initializer';

// initialize('yourVersion', 'yourName', 'yourOwnerId')
//   .then((result) => {
//     console.log('Success:', result);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
