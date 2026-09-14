import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

const skills = [
  { name: "HTML & CSS", progress: 90 },
  { name: "JavaScript", progress: 75 },
  { name: "React.js", progress: 60 },
  { name: "Node.js", progress: 40 },
  { name: "Express.js", progress: 30 },
  { name: "PostgreSQL", progress: 25 },
  { name: "Git & GitHub", progress: 70 },
  { name: "DSA", progress: 45 },
];

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("skillbridgeUser")) || null
  );

  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("dashboard");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful! Please login.");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setAuthMode("login");
    } catch (error) {
      setMessage("Cannot connect to backend.");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("skillbridgeToken", data.token);
      localStorage.setItem("skillbridgeUser", JSON.stringify(data.user));

      setUser(data.user);
      setPage("dashboard");
      setMessage("");

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage("Cannot connect to backend.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("skillbridgeToken");
    localStorage.removeItem("skillbridgeUser");

    setUser(null);
    setAuthMode("login");
    setPage("dashboard");
  };

  // ================================
  // LOGIN / REGISTER
  // ================================

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-logo">
            Skill<span>Bridge</span>
          </div>

          {authMode === "login" ? (
            <>
              <h1>Welcome Back 👋</h1>
              <p className="auth-subtitle">
                Login to continue your learning journey.
              </p>

              <form onSubmit={handleLogin}>

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button className="auth-button" type="submit">
                  Login
                </button>

              </form>

              {message && (
                <p className="auth-message">{message}</p>
              )}

              <p className="switch-text">
                Don't have an account?

                <button
                  className="link-button"
                  onClick={() => {
                    setAuthMode("register");
                    setMessage("");
                  }}
                >
                  Create Account
                </button>
              </p>
            </>
          ) : (
            <>
              <h1>Create Account</h1>
              <p className="auth-subtitle">
                Start building your career with SkillBridge.
              </p>

              <form onSubmit={handleRegister}>

                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button className="auth-button" type="submit">
                  Create Account
                </button>

              </form>

              {message && (
                <p className="auth-message">{message}</p>
              )}

              <p className="switch-text">
                Already have an account?

                <button
                  className="link-button"
                  onClick={() => {
                    setAuthMode("login");
                    setMessage("");
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

        </div>
      </div>
    );
  }

  // ================================
  // DASHBOARD
  // ================================

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          Skill<span>Bridge</span>
        </div>

        <div className="nav">

          <button
            className={page === "dashboard" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("dashboard")}
          >
            📊 <span>Dashboard</span>
          </button>

          <button
            className={page === "skills" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("skills")}
          >
            🧠 <span>My Skills</span>
          </button>

          <button
            className={page === "roadmap" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("roadmap")}
          >
            🗺️ <span>Roadmap</span>
          </button>

          <button
            className={page === "jobs" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("jobs")}
          >
            💼 <span>Jobs</span>
          </button>

          <button
            className={page === "profile" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("profile")}
          >
            👤 <span>Profile</span>
          </button>

        </div>

        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <h1>
              {page === "dashboard" && "Dashboard"}
              {page === "skills" && "My Skills"}
              {page === "roadmap" && "Learning Roadmap"}
              {page === "jobs" && "Jobs & Internships"}
              {page === "profile" && "My Profile"}
            </h1>

            <p>
              Build your skills. Bridge your career.
            </p>
          </div>

          <div className="user-info">

            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>

          </div>

        </header>

        {/* ================================
            DASHBOARD PAGE
        ================================= */}

        {page === "dashboard" && (
          <>
            <section className="hero">

              <div>
                <h2>
                  Welcome back, {user.name}! 👋
                </h2>

                <p>
                  Keep learning and get closer to your dream job.
                </p>

                <button
                  onClick={() => setPage("roadmap")}
                  className="hero-button"
                >
                  View My Roadmap →
                </button>
              </div>

              <div className="hero-icon">
                🚀
              </div>

            </section>

            {/* STATS */}

            <section className="stats">

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div>
                  <h3>Full Stack Developer</h3>
                  <p>Target Role</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div>
                  <h3>58%</h3>
                  <p>Overall Progress</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🧠</div>
                <div>
                  <h3>8</h3>
                  <p>Skills Tracked</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div>
                  <h3>7 Days</h3>
                  <p>Learning Streak</p>
                </div>
              </div>

            </section>

            {/* SKILLS */}

            <section>

              <div className="section-heading">
                <div>
                  <h2>Your Skills</h2>
                  <p>Track your technical skills.</p>
                </div>

                <button
                  onClick={() => setPage("skills")}
                  className="view-button"
                >
                  View All
                </button>
              </div>

              <div className="skill-grid">

                {skills.slice(0, 6).map((skill) => (
                  <div className="skill-card" key={skill.name}>

                    <div className="skill-title">
                      <strong>{skill.name}</strong>
                      <span>{skill.progress}%</span>
                    </div>

                    <div className="progress-background">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${skill.progress}%`,
                        }}
                      ></div>
                    </div>

                    <p>
                      {skill.progress >= 70
                        ? "Good progress"
                        : "Keep improving"}
                    </p>

                  </div>
                ))}

              </div>

            </section>

            {/* BOTTOM */}

            <div className="bottom-grid">

              <div className="content-card">

                <h2>⚠️ Skill Gap</h2>

                <p className="card-subtitle">
                  Skills you should focus on next.
                </p>

                <div className="gap-row">
                  <span>PostgreSQL</span>
                  <span className="badge">Beginner</span>
                </div>

                <div className="gap-row">
                  <span>Express.js</span>
                  <span className="badge">Beginner</span>
                </div>

                <div className="gap-row">
                  <span>Node.js</span>
                  <span className="badge">Intermediate</span>
                </div>

                <button
                  className="full-button"
                  onClick={() => setPage("roadmap")}
                >
                  Start Learning
                </button>

              </div>

              <div className="content-card">

                <h2>🗺️ Current Roadmap</h2>

                <p className="card-subtitle">
                  Your learning journey.
                </p>

                <div className="roadmap-small completed">
                  ✓ HTML & CSS
                </div>

                <div className="roadmap-small completed">
                  ✓ JavaScript
                </div>

                <div className="roadmap-small current">
                  → React.js
                </div>

                <div className="roadmap-small">
                  ○ Node.js
                </div>

              </div>

            </div>
          </>
        )}

        {/* ================================
            SKILLS PAGE
        ================================= */}

        {page === "skills" && (
          <section>

            <div className="page-title">
              <h2>My Skills 🧠</h2>
              <p>
                Track your current technical skills and improve them.
              </p>
            </div>

            <div className="skill-grid large-grid">

              {skills.map((skill) => (
                <div className="skill-card large" key={skill.name}>

                  <div className="skill-title">
                    <strong>{skill.name}</strong>
                    <span>{skill.progress}%</span>
                  </div>

                  <div className="progress-background">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${skill.progress}%`,
                      }}
                    ></div>
                  </div>

                  <button className="update-button">
                    Update Skill
                  </button>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* ================================
            ROADMAP
        ================================= */}

        {page === "roadmap" && (
          <section>

            <div className="page-title">
              <h2>Full Stack Developer Roadmap 🗺️</h2>
              <p>
                Follow this roadmap to become job-ready.
              </p>
            </div>

            <div className="roadmap">

              <RoadStep
                number="✓"
                title="HTML & CSS"
                description="Learn webpage structure, styling and responsive design."
                status="completed"
              />

              <RoadStep
                number="✓"
                title="JavaScript"
                description="Learn programming fundamentals, ES6 and DOM."
                status="completed"
              />

              <RoadStep
                number="3"
                title="React.js"
                description="Learn components, hooks, state management and API integration."
                status="current"
              />

              <RoadStep
                number="4"
                title="Node.js & Express.js"
                description="Build backend applications and REST APIs."
              />

              <RoadStep
                number="5"
                title="PostgreSQL"
                description="Learn SQL, database design and relationships."
              />

              <RoadStep
                number="6"
                title="DSA & Interview Preparation"
                description="Practice coding problems and prepare for technical interviews."
              />

            </div>

          </section>
        )}

        {/* ================================
            JOBS
        ================================= */}

        {page === "jobs" && (
          <section>

            <div className="page-title">
              <h2>Jobs & Internships 💼</h2>
              <p>
                Find opportunities that match your skills.
              </p>
            </div>

            <div className="jobs">

              <Job
                title="Frontend Developer Intern"
                company="Tech Solutions"
                location="Bengaluru"
                skills="React • JavaScript • CSS"
              />

              <Job
                title="Full Stack Developer Intern"
                company="Startup Labs"
                location="Bengaluru"
                skills="React • Node.js • PostgreSQL"
              />

              <Job
                title="Software Engineer Intern"
                company="InnovateTech"
                location="Hyderabad"
                skills="Java • DSA • SQL"
              />

            </div>

          </section>
        )}

        {/* ================================
            PROFILE
        ================================= */}

        {page === "profile" && (
          <section>

            <div className="profile-card">

              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <h2>{user.name}</h2>

              <p>
                Computer Science & Engineering Student
              </p>

              <div className="profile-details">

                <div>
                  <strong>Name</strong>
                  <span>{user.name}</span>
                </div>

                <div>
                  <strong>Email</strong>
                  <span>{user.email}</span>
                </div>

                <div>
                  <strong>Target Role</strong>
                  <span>Full Stack Developer</span>
                </div>

                <div>
                  <strong>Target Role</strong>
                  <span>Full Stack Developer</span>
                </div>

                <div>
                  <strong>Experience</strong>
                  <span>Fresher</span>
                </div>

              </div>

              <button className="primary-button">
                Edit Profile
              </button>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

/* Roadmap component */

function RoadStep({
  number,
  title,
  description,
  status = "",
}) {
  return (
    <div className={`road-step ${status}`}>

      <div className="step-number">
        {number}
      </div>

      <div className="step-content">

        <h3>{title}</h3>

        <p>{description}</p>

        {status === "current" && (
          <button className="continue-button">
            Continue Learning
          </button>
        )}

      </div>

    </div>
  );
}

/* Job component */

function Job({
  title,
  company,
  location,
  skills,
}) {
  return (
    <div className="job-card">

      <div>
        <h3>{title}</h3>

        <p>
          {company} • {location}
        </p>

        <span>{skills}</span>
      </div>

      <button className="apply-button">
        Apply
      </button>

    </div>
  );
}

export default App;
