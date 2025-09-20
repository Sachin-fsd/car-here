import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const initialState = {
  name: "",
  email: "",
  profile_img: "",
  license: "",
  pan: "",
  aadhaar: "",
  bank: "",
  rc: "",
  insurance: "",
  permit: "",
  police: "",
};

export default function DriverProfile() {
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from("driver_verification")
          .select("*")
          .eq("email", user.email)
          .single();
        if (data) setForm({ ...initialState, ...data });
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    let profile_img_url = form.profile_img;
    if (files.profile_img) {
      const { data, error } = await supabase.storage.from("driver-docs").upload(`profile_img/${user.id}_${Date.now()}_${files.profile_img.name}`, files.profile_img, { upsert: true });
      if (!error && data) {
        const { publicUrl } = supabase.storage.from("driver-docs").getPublicUrl(data.path);
        profile_img_url = publicUrl;
      }
    }
    const { error } = await supabase
      .from("driver_verification")
      .upsert([{ ...form, email: user?.email, name: user?.user_metadata?.name || form.name, profile_img: profile_img_url }]);
    for (const key in files) {
      if (key !== "profile_img" && files[key]) {
        await supabase.storage.from("driver-docs").upload(`${key}/${user.id}_${Date.now()}_${files[key].name}`, files[key], { upsert: true });
      }
    }
    setLoading(false);
    setSuccess(!error);
    setForm(f => ({ ...f, profile_img: profile_img_url }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-blue-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-0">
      <div className="w-full max-w-2xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl mt-12">
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={() => navigate('/driver')}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-150"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-400 drop-shadow text-center">Driver Profile & Verification</h2>
      </div>
      <div className="flex flex-col items-center mb-8">
        {form.profile_img ? (
          <img src={form.profile_img} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-2 border-4 border-blue-500 shadow-lg" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center mb-2 text-4xl text-gray-500 shadow-lg">?</div>
        )}
        <input type="file" name="profile_img" onChange={handleFileChange} className="mb-2" />
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{form.name || user?.user_metadata?.name || "Name not set"}</div>
        <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">{form.email || user?.email || "Email not set"}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Driver’s License (Permanent)</label>
          <input type="text" name="license" value={form.license} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="license" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">PAN Card</label>
          <input type="text" name="pan" value={form.pan} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="pan" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Aadhaar Card / Govt ID</label>
          <input type="text" name="aadhaar" value={form.aadhaar} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="aadhaar" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Bank Account Details</label>
          <input type="text" name="bank" value={form.bank} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block font-semibold mb-2">Vehicle Registration Certificate (RC)</label>
          <input type="text" name="rc" value={form.rc} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="rc" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Vehicle Insurance</label>
          <input type="text" name="insurance" value={form.insurance} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="insurance" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Permit & Fitness Certificate</label>
          <input type="text" name="permit" value={form.permit} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="file" name="permit" onChange={handleFileChange} className="mt-2" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Police Verification Certificate</label>
          <input type="text" name="police" value={form.police} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="file" name="police" onChange={handleFileChange} className="mt-2" />
        </div>
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold rounded-xl shadow hover:scale-105 transition-transform duration-150" disabled={loading}>{loading ? "Saving..." : "Submit Verification"}</button>
        {success && <div className="text-green-600 font-bold text-center mt-4">Details submitted successfully!</div>}
      </form>
      </div>
    </div>
  );
}
