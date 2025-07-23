import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const User = (props) => (
  <tr className="border-b flex flex-col text-center">
    <td className="p-4">{props.user.name}</td>
    <td className="p-4">{props.user.date}</td>
  </tr>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const navigate = useNavigate();

  // This method fetches the Users from the database.
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const Users = await response.json();
      setIsLoading(false);
      setUsers(Users);
    }
    getUsers();
    return;
  }, [users.length]);

  // This method will delete a User
  async function deleteUser(id) {
    await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      method: "DELETE",
    });
    const newUsers = users.filter((el) => el._id !== id);
    setUsers(newUsers);
  }

  // This method will map out the User on the table
  function usersList() {
    return users.map((user) => {
      return <User key={user._id} user={user} />;
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    //const isNew = !users.find((user) => user.name === name);

    try {
      let response;
      let newUser = { id: "", name: name, date: new Date().toString() };

      response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        if (response.statusText === "Error 404: Name exists") setIsNew(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setIsNew(true);
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setName("");
      navigate("/");
    }
  }

  // This following section will display the table with the User of individuals.
  return (
    <>
      {isLoading ? (
        <>
          <div className="border rounded-lg w-full">
            <div role="status">
              <h3 className="text-center text-1xl font-semibold p-4 mb-2">Waiting for server to respond...</h3>
              <div className="text-center">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300 mb-6"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <tbody className="[&_tr:last-child]:border-0">{usersList()}</tbody>
              </table>
            </div>
          </div>

          <form onSubmit={onSubmit} className="my-6 border rounded-lg overflow-hidden p-4">
            {!isNew && <h3 className="text-center text-1xl font-semibold pb-3 text-red-500">Name already exists. Add a new name</h3>}

            <div className="sm:col-span-4">
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <input
              type="submit"
              value="Add Name"
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-black h-9 rounded-md px-3 cursor-pointer mt-4"
            />
          </form>
        </>
      )}
    </>
  );
}
