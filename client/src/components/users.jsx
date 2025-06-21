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
  const navigate = useNavigate();

  // This method fetches the Users from the database.
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`http://localhost:5050/users/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const Users = await response.json();
      setUsers(Users);
    }
    getUsers();
    return;
  }, [users.length]);

  // This method will delete a User
  async function deleteUser(id) {
    await fetch(`http://localhost:5050/users/${id}`, {
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

    const isNew = !users.find((user) => user.name === name);

    try {
      let response;
      let newUser = { id: "", name: name, date: new Date().toString() };
      if (isNew) {
        response = await fetch("http://localhost:5050/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (users.length >= 10) {
          await deleteUser(users[Math.floor(Math.random() * users.length)]._id);
        } else {
          setUsers([...users, newUser]);
        }
      } else {
        console.log("Not a new name");
        return;
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
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <tbody className="[&_tr:last-child]:border-0">{usersList()}</tbody>
          </table>
        </div>
      </div>

      <form onSubmit={onSubmit} className="my-6 border rounded-lg overflow-hidden p-4">
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
  );
}
