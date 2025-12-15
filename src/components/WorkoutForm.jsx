import { useState } from "react";
import api from "../api/axios";

export default function WorkoutForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("strength");
         
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/workouts", { title, category });
    setTitle("");
    onAdd();
  };

  return (
    <form onSubmit={submit}>
      <input 
        placeholder="Workout title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />
      <select 
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
      >
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
      </select>

      <button type="submit">Add Workout</button>
    </form>
  );
}
