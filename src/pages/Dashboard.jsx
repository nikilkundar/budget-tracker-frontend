import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { logout } from "../services/auth";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    apiFetch("/expenses").then((data) => {
      if (data) setExpenses(data);
    });
  }, []);

  const categoryData = expenses.reduce((acc, curr) => {
    const found = acc.find((item) => item.name === curr.category);

    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }

    return acc;
  }, []);
  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"];

  const monthlyData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const found = acc.find((item) => item.month === month);

    if (found) {
      found.total += curr.amount;
    } else {
      acc.push({ month, total: curr.amount });
    }

    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Add Expense</h2>

      <form
        className="bg-white p-4 rounded shadow mt-4 grid grid-cols-1 gap-3 max-w-md"
        onSubmit={async (e) => {
          e.preventDefault();

          const data = await apiFetch("/expenses", {
            method: "POST",
            body: JSON.stringify({
              title,
              amount: Number(amount),
              category,
              notes,
            }),
          });

          if (data) {
            setExpenses([data, ...expenses]);
            setTitle("");
            setAmount("");
            setCategory("");
            setNotes("");
          }
        }}
      >
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="border p-2 rounded"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          className="border p-2 rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Expense
        </button>
      </form>

      <h2 className="mt-10 text-xl font-semibold">Category-wise Spending</h2>

      <div className="bg-white mt-4 p-4 rounded shadow h-80">
        {categoryData.length === 0 ? (
          <p className="text-gray-500">No data to show</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Monthly Spending</h2>

      <div className="bg-white mt-4 p-4 rounded shadow h-80">
        {monthlyData.length === 0 ? (
          <p className="text-gray-500">No data to show</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <h2 className="mt-6 text-xl font-semibold">Your Expenses</h2>

      <div className="mt-4 space-y-2">
        {expenses.map((e) => (
          <div key={e.id} className="bg-white p-4 rounded shadow">
            {editingId === e.id ? (
              <>
                <input
                  className="border p-1 w-full"
                  value={e.title}
                  onChange={(ev) =>
                    setExpenses(
                      expenses.map((x) =>
                        x.id === e.id ? { ...x, title: ev.target.value } : x
                      )
                    )
                  }
                />

                <input
                  className="border p-1 w-full mt-1"
                  type="number"
                  value={e.amount}
                  onChange={(ev) =>
                    setExpenses(
                      expenses.map((x) =>
                        x.id === e.id ? { ...x, amount: ev.target.value } : x
                      )
                    )
                  }
                />

                <button
                  onClick={async () => {
                    await apiFetch(`/expenses/${e.id}`, {
                      method: "PUT",
                      body: JSON.stringify({
                        title: e.title,
                        amount: Number(e.amount),
                        category: e.category,
                        notes: e.notes,
                      }),
                    });
                    setEditingId(null);
                  }}
                  className="text-green-600 mr-2"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="font-bold">{e.title}</p>
                <p>₹ {e.amount}</p>
                <p className="text-sm text-gray-500">{e.category}</p>

                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => setEditingId(e.id)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={async () => {
                      await apiFetch(`/expenses/${e.id}`, { method: "DELETE" });
                      setExpenses(expenses.filter((x) => x.id !== e.id));
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
