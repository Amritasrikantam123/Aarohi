import React, { useState } from "react";
import {
  User, Calendar, MapPin, Phone, Mail,
  BookOpen, GraduationCap, AlertCircle, ArrowLeft, Link2
} from "lucide-react";

import { API } from "../api";

export default function Registration({
  onBackToHome,
  onRegistrationSuccess,
  currentLang = "en",
  isMentorMode = false
}) {

  const [isLoginMode, setIsLoginMode] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: "",
    age: "",
    school: "",
    className: "",
    state: "Rajasthan",
    district: "",
    familyIncome: "",
    contact: "",
    email: "",
    careerInterests: [],
    avatar: ""
  });

  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "",
    organization: "",
    field: "Engineering & Technology",
    state: "Telangana",
    languages: [],
    experience: "5 Years",
    bio: "",
    proof: ""
  });

  const [authForm, setAuthForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const validateStudent = () => {
    let err = {};

    if (!authForm.email.includes("@")) err.email = "Valid email required";
    if (!authForm.password || authForm.password.length < 4) err.password = "Min 4 chars";

    if (!isLoginMode) {
      if (!studentForm.name) err.name = "Name required";
      if (!studentForm.age) err.age = "Age required";
      if (!studentForm.school) err.school = "School required";
      if (!studentForm.contact) err.contact = "Contact required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateMentor = () => {
    let err = {};

    if (!authForm.email.includes("@")) err.email = "Valid email required";
    if (!authForm.password || authForm.password.length < 4) err.password = "Min 4 chars";

    if (!isLoginMode) {
      if (!mentorForm.name) err.name = "Name required";
      if (!mentorForm.role) err.role = "Role required";
      if (!mentorForm.organization) err.organization = "Org required";
      if (!mentorForm.bio) err.bio = "Bio required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudent()) return;

    try {
      const endpoint = isLoginMode ? API.login : API.register;

      const payload = isLoginMode
        ? { email: authForm.email, password: authForm.password }
        : {
            name: studentForm.name,
            email: authForm.email,
            password: authForm.password,
            role: "student",
            age: Number(studentForm.age),
            school: studentForm.school,
            class: studentForm.className,
            district: studentForm.district,
            state: studentForm.state,
            familyIncome: Number(studentForm.familyIncome),
            contact: studentForm.contact,
            careerInterests: studentForm.careerInterests,
            avatar: studentForm.avatar || ""
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Authentication failed");
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);

      alert(isLoginMode ? "Login successful!" : "Registration successful!");

      onRegistrationSuccess?.(data.user || payload);

    } catch (err) {
      console.error(err);
      alert("Backend connection error");
    }
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    if (!validateMentor()) return;

    try {
      const endpoint = isLoginMode ? API.login : API.register;

      const payload = isLoginMode
        ? { email: authForm.email, password: authForm.password }
        : {
            name: mentorForm.name,
            email: authForm.email,
            password: authForm.password,
            role: "mentor",
            organization: mentorForm.organization,
            field: mentorForm.field,
            state: mentorForm.state,
            languages: mentorForm.languages.length ? mentorForm.languages : ["English"],
            experience: mentorForm.experience,
            bio: mentorForm.bio,
            proof: mentorForm.proof,
            status: "pending"
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Authentication failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert(
        isLoginMode
          ? "Login successful!"
          : "Application submitted successfully!"
      );

      onBackToHome?.();

    } catch (err) {
      console.error(err);
      alert("Backend connection error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={onBackToHome}>
        <ArrowLeft /> Back
      </button>

      <h2>{isMentorMode ? "Mentor Registration" : "Student Registration"}</h2>

      <form onSubmit={isMentorMode ? handleMentorSubmit : handleStudentSubmit}>

        <input
          placeholder="Email"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={authForm.password}
          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
        />
        {errors.password && <p>{errors.password}</p>}

        {!isLoginMode && !isMentorMode && (
          <>
            <input
              placeholder="Name"
              value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
            />
            <input
              placeholder="School"
              value={studentForm.school}
              onChange={(e) => setStudentForm({ ...studentForm, school: e.target.value })}
            />
          </>
        )}

        {!isLoginMode && isMentorMode && (
          <>
            <input
              placeholder="Name"
              value={mentorForm.name}
              onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
            />
            <input
              placeholder="Organization"
              value={mentorForm.organization}
              onChange={(e) => setMentorForm({ ...mentorForm, organization: e.target.value })}
            />
          </>
        )}

        <button type="submit">
          {isLoginMode ? "Login" : "Submit"}
        </button>

      </form>

      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        Switch to {isLoginMode ? "Register" : "Login"}
      </button>
    </div>
  );
}