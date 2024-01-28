import { useState, useEffect, SetStateAction, useRef } from 'react'
import './Popup.css'
import packageData from '../../package.json'
import { Spinner, TextInput, Label, Tabs, TabsRef, Badge } from 'flowbite-react';
import { loginPost } from './components/login';
import { registerPost } from './components/register';
import { licensePost } from './components/license';
import { upgradePost } from './components/upgrade';
import { checkSession } from './components/checksession';
import { initialize } from './components/initializer';

let AppName = packageData.KeyAuth.AppName;
let OwnerId = packageData.KeyAuth.OwnerId;
let Version = packageData.KeyAuth.Version;

interface Subscription {
  subscription: string;
  key: string | null;
  expiry: number;
  timeleft: number;
  level: string;
}

interface UserData {
  username: string;
  subscriptions: Subscription[];
  ip: string;
  hwid: string | null;
  createdate: number;
  lastlogin: number;
}

export const Popup = () => {

  if (AppName == "" || OwnerId == "" || Version == "") {
    return (
      <div className='grid place-items-center p-4 text-white'>
        <span className='text-red-500'>Error: <br></br><span className='text-white text-xs'>Please set up the package.json KeyAuth Credentials!</span></span>
      </div>
    )
  }

  const [sessionId, setSessionId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [license, setLicense] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({} as UserData);
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  const init = async () => {
    try {
      var data = await initialize(Version, AppName, OwnerId);

      if (data.success) {
        localStorage.setItem('sessionId', data.sessionid);
        setSessionId(data.sessionid);
      } else {
        setError(data.message == "invalidver" ? "Invalid Application version!" : data.message);
        if (data.message.includes('sessionid')) {
          localStorage.clear();
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedSessionId = localStorage.getItem('sessionId');
      const storedUserData = localStorage.getItem('userData');

      if (!storedSessionId) {
        init();
      } else {
        var sessionStatus = await checkSession(storedSessionId, AppName, OwnerId);
        if (sessionStatus.success) {
          console.log('Session is valid!');

          setSessionId(storedSessionId);

          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setActiveTab(4);
          }
        } else {
          console.log('Session is invalid!');
          localStorage.clear();
          init();
        }
      }
    };

    fetchData();
  }, []);

  const handleLoginSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await loginPost(username, password, sessionId, AppName, OwnerId);

      if (data.success) {
        console.log(data.info)
        setUserData(data.info);
        localStorage.setItem('userData', JSON.stringify(data.info));
        setActiveTab(4);
        console.log('Form submitted successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await registerPost(username, password, license, sessionId, AppName, OwnerId);

      if (data.success) {
        setUserData(data.info);
        localStorage.setItem('userData', JSON.stringify(data.info));
        setActiveTab(4);
        console.log('Form submitted successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLicenseSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await licensePost(license, sessionId, AppName, OwnerId);

      if (data.success) {
        setUserData(data.info);
        localStorage.setItem('userData', JSON.stringify(data.info));
        setActiveTab(4);
        console.log('Form submitted successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await upgradePost(username, license, sessionId, AppName, OwnerId);
      alert(data.message);
      if (data.success) {
        setActiveTab(0);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
  };

  const handleLicenseChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setLicense(e.target.value);
  }

  function convertTimestamp(timestamp: number): string {
    const d = new Date(timestamp * 1000);
    const yyyy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    const hh = d.getHours();
    let h = hh;
    const min = ('0' + d.getMinutes()).slice(-2);
    let ampm = 'AM';
    let time;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }

    // Example: 2013-02-18, 8:35 AM
    time = `${yyyy}-${mm}-${dd} @ ${h}:${min} ${ampm}`;

    return time;
  }


  return (
    <main>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-sm text-center font-bold leading-tight tracking-tight md:text-2xl text-white">
          KeyAuth Chrome Extension
        </h1>

        {error != "" ? (
          <div className='grid place-items-center p-4 text-white'>
            <span className='text-red-500 text-lg'>Error: <span className='text-xs text-white'>{error}</span></span>
          </div>
        ) : !sessionId ? (
          <div className='grid place-items-center p-4 text-white'>
            <Spinner color={""} className='text-[#0f0f17] fill-blue-500' />
            <span className='mt-3'>Intializing....</span>
          </div>
        ) : (
          <Tabs style={"default"} theme={{
            base: "",
            tablist: {
              base: "hidden",
              styles: {
                default: "hidden"
              },
              tabitem: {
                base: "hidden",
                styles: {
                  default: {
                    base: "hidden",
                    active: {
                      off: "hidden",
                      on: "hidden"
                    }
                  }
                }
              }
            },
            tabpanel: "",
            tabitemcontainer: {
              base: "",
              styles: {
                default: ""
              }
            }
          }} ref={tabsRef}>

            {
              activeTab === 0 ? (
                <Tabs.Item title="Tab 1">
                  <form className="space-y-4 md:space-y-6" onSubmit={handleLoginSubmit}>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="username" value="Your username" />
                      </div>

                      <TextInput id='username' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="password" value="Your password" />
                      </div>
                      <TextInput id='password' type='password' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className='flex items-center'>
                      <p className="text-xs font-medium text-gray-400 text-center">
                        Upgrade account? {" "}
                        <span
                          className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                            setActiveTab(2);
                          }}
                        >
                          Click here
                        </span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner color={""} className='text-[#0f0f17] fill-blue-500' /> : 'Sign in'}
                    </button>
                    <p className="text-sm font-medium text-gray-400">
                      Don’t have an account yet? {" "}
                      <span
                        className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                          setActiveTab(1);
                        }}
                      >
                        Sign Up
                      </span>
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      Login using license? {" "}
                      <span
                        className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                          setActiveTab(3);
                        }}
                      >
                        Click here
                      </span>
                    </p>
                  </form>
                </Tabs.Item>
              ) : activeTab === 1 ? (
                <Tabs.Item title="">
                  <form className="space-y-4 md:space-y-6" onSubmit={handleRegisterSubmit}>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="username" value="Your username" />
                      </div>

                      <TextInput id='username' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="password" value="Your password" />
                      </div>
                      <TextInput id='password' type='password' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="license" value="Your license" />
                      </div>
                      <TextInput id='license' type='text' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={license}
                        onChange={handleLicenseChange}
                        placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner color={""} className='text-[#0f0f17] fill-blue-500' /> : 'Sign Up'}
                    </button>
                    <p className="text-sm font-medium text-gray-400">
                      Return to login? {" "}
                      <span
                        className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                          setActiveTab(0);
                        }}
                      >
                        Click here
                      </span>
                    </p>
                  </form>
                </Tabs.Item>
              ) : activeTab === 2 ? (
                <Tabs.Item title="">
                  <form className="space-y-4 md:space-y-6" onSubmit={handleUpgradeSubmit}>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="username" value="Your username" />
                      </div>

                      <TextInput id='username' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="license" value="Your license" />
                      </div>
                      <TextInput id='license' type='text' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={license}
                        onChange={handleLicenseChange}
                        placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner color={""} className='text-[#0f0f17] fill-blue-500' /> : 'Upgrade Account'}
                    </button>
                    <p className="text-sm font-medium text-gray-400">
                      Return to login? {" "}
                      <span
                        className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                          setActiveTab(0);
                        }}
                      >
                        Click here
                      </span>
                    </p>
                  </form>
                </Tabs.Item>
              ) : activeTab === 3 ? (
                <Tabs.Item title="">
                  <form className="space-y-4 md:space-y-6" onSubmit={handleLicenseSubmit}>
                    <div>
                      <div className="mb-2 block">
                        <Label color={""} theme={{
                          root: {
                            base: "text-white text-sm font-medium"
                          }
                        }} htmlFor="license" value="Your license" />
                      </div>
                      <TextInput id='license' type='text' color={""} theme={{
                        field: {
                          input: {
                            base: "bg-[#0f0f17] border border-[#0f0f17]/80 text-white sm:text-sm rounded-lg focus:ring-[#0f0f17] focus:border-[#0f0f17] block w-full p-2.5"
                          }
                        }
                      }}
                        value={license}
                        onChange={handleLicenseChange}
                        placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner color={""} className='text-[#0f0f17] fill-blue-500' /> : 'Sign In'}
                    </button>
                    <p className="text-sm font-medium text-gray-400">
                      Back to login? {" "}
                      <span
                        className="font-medium hover:underline text-blue-500 cursor-pointer" onClick={() => {
                          setActiveTab(0);
                        }}
                      >
                        Click here
                      </span>
                    </p>
                  </form>
                </Tabs.Item>
              ) : activeTab === 4 ? (
                <Tabs.Item title="">
                  <div className="">
                    {
                      userData ? (
                        <div>
                          <div className='p-1.5 text-white'>
                            <h2 className='text-base font-semibold'>Hey {userData.username} 👋</h2>
                            <h3>
                              IP Address: {userData.ip}
                            </h3>
                            <h3>
                              HWID: {userData.hwid || "Not set!"}
                            </h3>
                            <h3>
                              Created: {convertTimestamp(userData.createdate)}
                            </h3>
                            <h3>
                              Last Login: {convertTimestamp(userData.lastlogin)}
                            </h3>
                          </div>

                          {
                            userData.subscriptions.map((subscription, index) => (
                              <div key={index} className="w-full text-white">
                                <div className="p-1.5 h-full rounded-lg">
                                  <div className="flex flex-wrap items-center justify-between -m-2">
                                    <div className="w-auto p-2">
                                      <div className="flex flex-wrap items-center -m-1.5">
                                        <div className="flex-1 p-1.5">
                                          <h3 className="font-heading mb-0.5 font-semibold">
                                            {subscription.subscription}
                                          </h3>
                                          <p className="text-xs text-gray-400">
                                            Expiry: {convertTimestamp(subscription.expiry)}
                                          </p>
                                        </div>

                                        <div className="flex ml-10 mt-1.5">
                                          <Badge color={"green"} theme={{
                                            root: {
                                              color: {
                                                green: "bg-green-500",
                                              }
                                            }
                                          }}>Active</Badge>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            ))
                          }

                          <button
                            type="submit"
                            className="mt-4 w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                            onClick={() => {
                              localStorage.clear();
                              window.location.reload();
                            }}
                          >
                            Sign Out
                          </button>

                        </div>
                      ) : (
                        <div className='grid place-items-center text-white'>
                          <Spinner color={""} className='text-[#0f0f17] fill-blue-500' />
                          <span className='mt-3'>Loading userdata...</span>
                          <button
                            type="submit"
                            className="mt-4 w-full text-white bg-[#0f0f17] hover:opacity-70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-100"
                            onClick={() => {
                              localStorage.clear();
                              window.location.reload();
                            }}
                          >
                            Sign Out
                          </button>
                        </div>
                      )
                    }
                  </div>
                </Tabs.Item>
              ) : (
                <Tabs.Item title="err">
                  <div className="grid place-items-center p-4 text-white">
                    ERROR LOADING, PLEASE RELOAD!
                  </div>
                </Tabs.Item>
              )
            }
          </Tabs>
        )}
      </div>
    </main>
  )
}

export default Popup
