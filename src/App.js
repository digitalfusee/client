import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Home routes
import HomeLayout from "./components/layout/HomeLayout";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";
import AboutView from "./views/AboutView";
import ContactView from "./views/ContactView";
import NotFoundView from "./views/NotFoundView";
import PeopleView from "./views/PeopleView";

// Instructor routes
import { InstructorProtectedRoute } from "./components/auth/ProtectedRoute";
import InstructorInbox from "./views/InstructorInbox";
import InstructorLayout from "./components/layout/InstructorLayout";
import InstructorCard from "./components/instructor/InstructorCard";
import Instuctors from "./components/instructor/index";

// Course routes
import AddCourse from "./components/course/AddCourse";
import EditCourse from "./components/course/EditCourse";
import { PublicCourse, InstructorCourse } from "./components/course/ViewCourse";
import { InstructorCourses, PublicCourses } from "./components/course/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home routes */}
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/account" element={<AccountView />} />
          <Route path="*" element={<NotFoundView />} />
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/courses/:courseId" element={<PublicCourse />} />
          <Route path="/instructors" element={<Instuctors />} />
        </Route>

        {/* Instructor routes */}
        <Route path="/instructor" element={<InstructorProtectedRoute />}>
          <Route path="/instructor" element={<InstructorLayout />}>
            <Route path="/instructor/inbox" element={<InstructorInbox />} />
            <Route path="/instructor/people" element={<PeopleView />} />
            <Route
              path="/instructor/:instructorId"
              element={<InstructorCard />}
            />
            <Route
              path="/instructor/dashboard"
              element={<InstructorCourses />}
            />
            <Route
              path="/instructor/courses/:courseId"
              element={<InstructorCourse />}
            />
            <Route path="/instructor/courses/add" element={<AddCourse />} />
            <Route
              path="/instructor/courses/edit/:courseId"
              element={<EditCourse />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
