'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
const STORAGE_KEY = 'pk_workspace_state_v3';
const INITIAL_STATE = {
    dob: '2004-02-13',
    myself: {
        fullName: 'Muhammed Anas P K',
        dob: '2004-02-13',
        phone: '+91 9072289496',
        bloodGroup: 'A+',
        address: 'Tharol Paramb (H), Machakkulam, Kuruvattoor (PO), Kozhikode, Kerala - 673611',
        photo: 'https://i.ibb.co/2sC4z80/image.png-f7bca70e-774b-436b-9bc6-fcd1f10e03c6',
        signature: 'https://i.ibb.co/x7V068Z/image.png-f0463be2-d975-49ee-9988-31e89e4d1162',
        documents: [
            { id: 1, name: 'Aadhaar Card', number: '9003 7217 9490', image: null },
            { id: 2, name: 'Driving License', number: 'KL57 20220006841', image: null },
            { id: 3, name: 'SSLC Reg No', number: '537433', image: null },
            { id: 4, name: 'Plus Two Reg No', number: '8357583', image: null },
            { id: 5, name: 'Passport Number', number: 'Y8297417', image: null },
            { id: 6, name: 'Ration Card', number: '2159171025', image: null },
            { id: 7, name: 'Calicut Univ Reg', number: 'TMAVAEG191', image: null },
            { id: 8, name: 'TSSR Diploma Reg', number: 'MUH/A20/10614', image: null },
            { id: 9, name: 'Birth Certificate', number: 'XII/2426/2004', image: null },
        ],
    },
    studyTracks: [
        {
            id: 1,
            name: 'B.Ed English (2024-2026)',
            degree: 'Bachelor of Education',
            duration: '2 Years (Semesters 1-4)',
            progressPercentage: 65,
            modules: [
                { id: 1001, trackId: 1, title: 'Foundations of Education & Learner Psychology', completed: true, completedAt: '2026-10-15', remarks: 'Unit completed' },
                { id: 1002, trackId: 1, title: 'English Language Pedagogy & Micro-Teaching Practicum', completed: false, dueDate: '2026-11-20' },
                { id: 1003, trackId: 1, title: 'Assessment, Evaluation & Diagnostic Testing in English', completed: false, dueDate: '2026-12-05' },
                { id: 1004, trackId: 1, title: 'Internship School Lesson Plans & Viva Portfolio', completed: false, dueDate: '2026-12-25' },
            ],
        },
        {
            id: 2,
            name: 'MA Arabic (Distance Mode)',
            degree: 'Master of Arts in Arabic',
            duration: 'Calicut University Distance',
            progressPercentage: 45,
            modules: [
                { id: 2001, trackId: 2, title: 'Classical Arabic Poetry & Syntactic Grammar Analysis', completed: true, completedAt: '2026-10-22' },
                { id: 2002, trackId: 2, title: 'Modern Arabic Literature & Fiction Criticism', completed: false, dueDate: '2026-11-28' },
                { id: 2003, trackId: 2, title: 'Advanced Translation Theory: Arabic to English & Vice-Versa', completed: false, dueDate: '2026-12-15' },
            ],
        },
        {
            id: 3,
            name: 'Fiqhul Usra (Islamic PG Diploma)',
            degree: 'Specialized Family Jurisprudence',
            duration: 'Higher Islamic Studies',
            progressPercentage: 35,
            modules: [
                { id: 3001, trackId: 3, title: 'Principles of Family Jurisprudence & Marital Rights', completed: false, dueDate: '2026-11-25' },
                { id: 3002, trackId: 3, title: 'Inheritance & Estate Distribution Rules', completed: false, dueDate: '2026-12-10' },
            ],
        },
        {
            id: 4,
            name: 'Certified Training & Speaking Course',
            degree: 'Leadership & Trainer Certification',
            duration: 'Master Facilitator Track',
            modules: [
                { id: 4001, trackId: 4, title: 'Public Speaking Foundations & Audience Engagement', completed: true, completedAt: '2026-10-30' },
                { id: 4002, trackId: 4, title: 'Workshop Curriculum Design & Youth Mentoring', completed: false, dueDate: '2026-11-30' },
            ],
        },
    ],
    exams: [
        { id: 101, course: 'B.Ed English', name: 'Pedagogy Mid-Term Exam', date: '2026-11-20', status: 'Upcoming' },
        { id: 102, course: 'MA Arabic (Distance)', name: 'Classical Literature Paper', date: '2026-12-05', status: 'Upcoming' },
    ],
    pastQualifications: [
        { id: 1, course: 'BA English Language & Literature', institution: 'University of Calicut (CGPA: 5.483, Grade: C) - Jan 2025' },
        { id: 2, course: 'Diploma in Counselling Psychology', institution: 'TSSR Council (Grade: A+) - Nov 2023' },
        { id: 3, course: 'Higher Secondary (Commerce)', institution: 'Govt. of Kerala (Reg: 8357583) - March 2021' },
        { id: 4, course: 'SSLC', institution: 'M J H S S Elettil (Reg: 537433) - March 2019' },
    ],
    completedStudyAreas: [
        { id: 1, area: 'English Phonetics & Linguistics Foundations' },
        { id: 2, area: 'Educational Psychology & Learning Theories' },
    ],
    todos: [
        { id: 1, task: 'Review B.Ed Lesson Plan draft for micro-teaching', priority: 'High', completed: false, date: '2026-11-08', time: '10:00' },
        { id: 2, task: 'Call SBI branch regarding new transaction slip', priority: 'Medium', completed: false, date: '2026-11-08', time: '14:30' },
        { id: 3, task: 'Complete Graphic Design client brand mockups', priority: 'High', completed: false, date: '2026-11-09', time: '18:00' },
    ],
    finishingTodos: [
        { id: 201, task: 'Finalize Arabic assignment submission PDF', completed: false, date: '2026-11-10', time: '20:00' },
    ],
    generalTodos: [
        { id: 301, task: 'Organize digital portfolio drive files', completed: false },
        { id: 302, task: 'Renew library membership card', completed: false },
    ],
    books: [
        { id: 1, title: 'Pedagogy of the Oppressed - Paulo Freire', totalPages: 180, pagesRead: 72 },
        { id: 2, title: 'Atomic Habits - James Clear', totalPages: 320, pagesRead: 245 },
    ],
    meetings: [
        { id: 1, person: 'College Mentor / Principal', purpose: 'Internship approval & signature', date: '2026-11-12', time: '11:00' },
    ],
    reels: [
        { id: 1, idea: '5 Tips to Master English Vocabulary for Beginners' },
        { id: 2, idea: 'Day in the life: B.Ed English + Graphic Design freelance' },
    ],
    trainingClasses: [
        { id: 1, topic: 'Public Speaking & Confidence Workshop', audience: 'High School Students (45 attendees)' },
    ],
    projects: [
        { id: 1, title: 'English Phonetics Interactive Audio Guide', type: 'Academic', deadline: '2026-12-15' },
        { id: 2, title: 'Local Business Identity & Branding Suite', type: 'Creative', deadline: '2026-11-25' },
    ],
    designProjects: [
        { id: 1, title: 'Minimalist Cafe Branding & Menu Card', client: 'Malabar Roast Cafe', date: '2026-11-15', time: '16:00', status: 'Designing' },
        { id: 2, title: 'Islamic PG Conference Banner & Badges', client: 'Al-Huda Academy', date: '2026-11-18', time: '12:00', status: 'Review' },
        { id: 3, title: 'Social Media Campaign Templates (10 Posts)', client: 'Apex Fitness Hub', date: '2026-11-22', time: '17:00', status: 'Pending' },
    ],
    designClients: [
        { id: 1, name: 'Malabar Roast Cafe', phone: '+91 9447102030', notes: 'Needs earthy tones, vector icons, printable A4 menus' },
        { id: 2, name: 'Al-Huda Academy', phone: '+91 9895001122', notes: 'Arabic calligraphy integration for annual summit' },
        { id: 3, name: 'Apex Fitness Hub', phone: '+91 9072004455', notes: 'Neon green aesthetic, high contrast posters' },
    ],
    finance: {
        receivables: [
            { id: 1, name: 'Malabar Cafe Branding Project (Advance Due)', amount: 6500, date: '2026-11-15', completed: false },
            { id: 2, name: 'Freelance Social Media Retainer (Anoop)', amount: 4000, date: '2026-11-20', completed: false },
        ],
        payables: [
            { id: 1, name: 'Calicut University Distance Exam Fee', amount: 1850, date: '2026-11-18', completed: false },
            { id: 2, name: 'Domain & Hosting Renewal for Portfolio', amount: 1200, date: '2026-11-28', completed: false },
        ],
        savings: [
            { id: 1, name: 'SBI Primary Savings Account', amount: 32450 },
            { id: 2, name: 'Emergency Liquid Cash Vault', amount: 8000 },
        ],
        needs: [
            { id: 1, name: 'New Graphics Drawing Tablet (Wacom/Huion)', amount: 7500, completed: false },
            { id: 2, name: 'Academic Reference Books for B.Ed Semester 2', amount: 2200, completed: false },
        ],
        bankDetails: {
            bankName: 'State Bank of India',
            accName: 'Muhammed Anas pk',
            accNumber: '40520615153',
            ifsc: 'SBIN0001757',
            gpayNumber: '9072289496',
            gpayName: 'Anas pk',
            upiId: 'muhammedanasz786-1@okaxis',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=muhammedanasz786-1@okaxis&pn=Muhammed%20Anas%20pk',
        },
    },
    travels: [
        {
            id: 1,
            destination: 'Wayanad Nature & Study Retreat',
            date: '2026-11-28',
            budget: 5000,
            expenses: [
                { id: 11, desc: 'KSRTC Bus Ticket to Kalpetta', amount: 240 },
                { id: 12, desc: 'Homestay advance booking', amount: 1800 },
            ],
        },
    ],
    events: [
        {
            id: 1,
            title: 'Youth Leadership & Communication Fest',
            concept: 'One-day interactive speaking boot-camp for college graduates',
            date: '2026-12-10',
            income: [
                { id: 1, desc: 'Delegate Registration Fees (30 x ₹250)', amount: 7500 },
                { id: 2, desc: 'Sponsorship by Local Books House', amount: 3000 },
            ],
            expense: [
                { id: 1, desc: 'Auditorium AC Hall Rent', amount: 4500 },
                { id: 2, desc: 'Delegate kits, certificates & refreshments', amount: 3200 },
            ],
        },
    ],
    family: [
        { id: 1, relation: 'Moideen Koya P K (Father)', phone: '9072289496', freq: 'Daily', lastCalled: 'Today' },
        { id: 2, relation: 'Sakkeena (Mother)', phone: '9072289496', freq: 'Daily', lastCalled: 'Today' },
        { id: 3, relation: 'Academic Advisor / Professor', phone: '+91 9446001234', freq: 'Weekly', lastCalled: 'Yesterday' },
    ],
    callLogs: [
        {
            id: 1,
            contactId: 1,
            relation: 'Moideen Koya P K (Father)',
            phone: '9072289496',
            date: '2026-11-08',
            time: '09:15 AM',
            remarks: 'Morning check-in. Informed about exam preparation.',
        },
        {
            id: 2,
            contactId: 2,
            relation: 'Sakkeena (Mother)',
            phone: '9072289496',
            date: '2026-11-08',
            time: '01:30 PM',
            remarks: 'Inquired about health and hostel stay.',
        },
    ],
    geminiSessions: [
        {
            id: 1,
            title: 'Study & Finance Planning',
            messages: [
                {
                    role: 'model',
                    text: 'Hello Anas! I am your personal Gemini AI assistant. I have live access to your B.Ed courses, exams, financial ledger, and design projects. How can I assist you today? Feel free to ask in English or Malayalam!',
                },
            ],
        },
    ],
    journalEntries: [
        {
            id: 1,
            date: '2026-11-08',
            time: '08:45 PM',
            title: 'Studio Design & Academic Goals Reflection',
            content: 'Finished drafting the new semester study plan and completed logo mockups for today\'s client. Grateful for the calm evening and clear focus. Tomorrow planning to read 30 more pages and prepare B.Ed presentation.',
            mood: 'Productive',
            tags: ['Design', 'Academic', 'Growth'],
            photos: [
                'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
            ],
            location: 'Calicut, Kerala',
            createdAt: '2026-11-08T20:45:00.000Z',
        },
    ],
};
const WorkspaceContext = createContext(null);
export function WorkspaceProvider({ children }) {
    const [state, setState] = useState(INITIAL_STATE);
    const [isHydrated, setIsHydrated] = useState(false);
    const [currentGeminiSessionId, setCurrentGeminiSessionId] = useState(() => {
        return state.geminiSessions[0]?.id || 1;
    });
    const [activeAlarm, setActiveAlarm] = useState(null);
    // Hydrate from localStorage on the client, then enable cloud sync
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setState({
                    ...INITIAL_STATE,
                    ...parsed,
                    journalEntries: Array.isArray(parsed.journalEntries)
                        ? parsed.journalEntries
                        : INITIAL_STATE.journalEntries,
                });
            }
        }
        catch (e) {
            console.error('Failed to load workspace state from localStorage', e);
        }
        setIsHydrated(true);
    }, []);
    // Sync to localStorage
    useEffect(() => {
        if (!isHydrated)
            return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
        catch (e) {
            console.error('Failed to sync to localStorage', e);
        }
    }, [state, isHydrated]);
    // MongoDB Connection & Sync State
    const [mongoStatus, setMongoStatus] = useState({
        configured: false,
        connected: false,
        database: null,
        error: null,
    });
    const refreshMongoStatus = async () => {
        try {
            const res = await fetch('/api/mongodb/status');
            if (res.ok) {
                const data = await res.json();
                setMongoStatus(data);
            }
        }
        catch {
            // server or offline fallback
        }
    };
    // Check MongoDB status & fetch initial data after local hydration
    useEffect(() => {
        if (!isHydrated)
            return;
        refreshMongoStatus();
        (async () => {
            try {
                const res = await fetch('/api/workspace');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.source === 'mongodb' && data.state) {
                        setState((prev) => ({
                            ...prev,
                            ...data.state,
                            journalEntries: Array.isArray(data.state.journalEntries)
                                ? data.state.journalEntries
                                : prev.journalEntries,
                        }));
                    }
                }
            }
            catch (err) {
                console.warn('Initial MongoDB sync skipped; operating on local state.', err);
            }
        })();
    }, [isHydrated]);
    // Background debounced auto-sync to MongoDB Atlas
    useEffect(() => {
        if (!isHydrated)
            return;
        const timer = setTimeout(async () => {
            try {
                await fetch('/api/workspace', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ state }),
                });
            }
            catch {
                // Silently buffered
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [state, isHydrated]);
    const syncNowWithDatabase = async () => {
        try {
            const res = await fetch('/api/workspace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state }),
            });
            const data = await res.json();
            await refreshMongoStatus();
            if (data && data.source === 'mongodb') {
                return { success: true, message: 'All workspace changes synced to MongoDB!' };
            }
            else {
                return {
                    success: false,
                    message: 'MongoDB not configured. Add MONGODB_URI in .env or Secrets to activate live cloud database storage.',
                };
            }
        }
        catch (err) {
            return { success: false, message: err.message || 'Sync failed' };
        }
    };
    // Deadline & Alarm Checker every 30s
    useEffect(() => {
        const checkDeadlines = () => {
            const now = new Date();
            const checkItem = (item, label) => {
                if (item.completed || item.alerted || !item.date || !item.time)
                    return;
                try {
                    const itemTime = new Date(`${item.date}T${item.time}`);
                    const diffMs = itemTime.getTime() - now.getTime();
                    // within 15 minutes before or 2 minutes past
                    if (diffMs > -120000 && diffMs <= 15 * 60 * 1000) {
                        setActiveAlarm(`${label}: ${item.task || item.person || item.title} (Due ${item.time})`);
                        // Audio chime using Web Audio
                        try {
                            const AudioCtx = window.AudioContext || window.webkitAudioContext;
                            if (AudioCtx) {
                                const ctx = new AudioCtx();
                                const osc = ctx.createOscillator();
                                const gain = ctx.createGain();
                                osc.type = 'sine';
                                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
                                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                                osc.connect(gain);
                                gain.connect(ctx.destination);
                                osc.start();
                                osc.stop(ctx.currentTime + 0.8);
                            }
                        }
                        catch (e) { }
                    }
                }
                catch (e) { }
            };
            state.todos.forEach((t) => checkItem(t, 'Action Task'));
            state.finishingTodos.forEach((t) => checkItem(t, 'Finishing Task'));
            state.meetings.forEach((m) => checkItem(m, 'Meeting'));
            state.designProjects.forEach((p) => checkItem(p, 'Design Project'));
        };
        const interval = setInterval(checkDeadlines, 30000);
        return () => clearInterval(interval);
    }, [state]);
    const updateState = (updater) => {
        setState((prev) => updater(prev));
    };
    const updateProfile = (profile) => {
        setState((prev) => ({
            ...prev,
            myself: { ...prev.myself, ...profile },
            dob: profile.dob || prev.dob,
        }));
    };
    // Age calculation
    const calculatedAge = React.useMemo(() => {
        const dobDate = new Date(state.myself.dob || state.dob || '2004-02-13');
        const diffMs = Date.now() - dobDate.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }, [state.myself.dob, state.dob]);
    // Net Finance Available = Savings + Receivables (uncompleted) - Payables (uncompleted)
    const netFinanceAvailable = React.useMemo(() => {
        const totalSavings = state.finance.savings.reduce((acc, s) => acc + (s.amount || 0), 0);
        const totalRec = state.finance.receivables.filter((r) => !r.completed).reduce((acc, r) => acc + (r.amount || 0), 0);
        const totalPay = state.finance.payables.filter((p) => !p.completed).reduce((acc, p) => acc + (p.amount || 0), 0);
        return totalSavings + totalRec - totalPay;
    }, [state.finance]);
    // Study Hub Actions
    const addStudyTrack = (name, degree) => {
        if (!name.trim())
            return;
        setState((prev) => ({
            ...prev,
            studyTracks: [
                ...prev.studyTracks,
                { id: Date.now(), name: name.trim(), degree: degree?.trim(), modules: [] },
            ],
        }));
    };
    const toggleStudyTrack = (id) => {
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.map((t) => {
                if (t.id !== id)
                    return t;
                const nextCompleted = !t.completed;
                return {
                    ...t,
                    completed: nextCompleted,
                    progressPercentage: nextCompleted
                        ? 100
                        : (t.progressPercentage === 100 ? 90 : (t.progressPercentage ?? 0)),
                    completedAt: nextCompleted
                        ? new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : undefined,
                };
            }),
        }));
    };
    const updateStudyTrackProgress = (id, percentage) => {
        const safePct = Math.max(0, Math.min(100, Math.round(Number(percentage) || 0)));
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.map((t) => {
                if (t.id !== id)
                    return t;
                const isNowCompleted = safePct >= 100;
                return {
                    ...t,
                    progressPercentage: safePct,
                    completed: isNowCompleted ? true : (safePct < 100 && t.completed ? false : t.completed),
                    completedAt: isNowCompleted
                        ? (t.completedAt || new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }))
                        : (safePct < 100 ? undefined : t.completedAt),
                };
            }),
        }));
    };
    const deleteStudyTrack = (id) => {
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.filter((t) => t.id !== id),
        }));
    };
    const addStudyTrackModule = (trackId, title, dueDate, category) => {
        if (!title.trim())
            return;
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.map((t) => {
                if (t.id !== trackId)
                    return t;
                const newModule = {
                    id: Date.now(),
                    trackId,
                    title: title.trim(),
                    category: category?.trim() || 'Assignment',
                    dueDate,
                    completed: false,
                };
                return {
                    ...t,
                    modules: [...(t.modules || []), newModule],
                };
            }),
        }));
    };
    const toggleStudyTrackModule = (trackId, moduleId, remarks) => {
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.map((t) => {
                if (t.id !== trackId)
                    return t;
                const updatedModules = (t.modules || []).map((m) => {
                    if (m.id !== moduleId)
                        return m;
                    const nextCompleted = !m.completed;
                    return {
                        ...m,
                        completed: nextCompleted,
                        completedAt: nextCompleted
                            ? new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })
                            : undefined,
                        remarks: remarks !== undefined ? remarks : m.remarks,
                    };
                });
                return { ...t, modules: updatedModules };
            }),
        }));
    };
    const deleteStudyTrackModule = (trackId, moduleId) => {
        setState((prev) => ({
            ...prev,
            studyTracks: prev.studyTracks.map((t) => {
                if (t.id !== trackId)
                    return t;
                return {
                    ...t,
                    modules: (t.modules || []).filter((m) => m.id !== moduleId),
                };
            }),
        }));
    };
    const addExam = (exam) => {
        setState((prev) => ({
            ...prev,
            exams: [...prev.exams, { id: Date.now(), ...exam }],
        }));
    };
    const toggleExamStatus = (id) => {
        setState((prev) => ({
            ...prev,
            exams: prev.exams.map((e) => e.id === id
                ? { ...e, status: e.status === 'Completed' ? 'Upcoming' : 'Completed' }
                : e),
        }));
    };
    const deleteExam = (id) => {
        setState((prev) => ({
            ...prev,
            exams: prev.exams.filter((e) => e.id !== id),
        }));
    };
    const addPastQualification = (course, institution) => {
        if (!course.trim())
            return;
        setState((prev) => ({
            ...prev,
            pastQualifications: [...prev.pastQualifications, { id: Date.now(), course: course.trim(), institution: institution.trim() }],
        }));
    };
    const deletePastQualification = (id) => {
        setState((prev) => ({
            ...prev,
            pastQualifications: prev.pastQualifications.filter((q) => q.id !== id),
        }));
    };
    const addCompletedStudyArea = (area) => {
        if (!area.trim())
            return;
        setState((prev) => ({
            ...prev,
            completedStudyAreas: [...prev.completedStudyAreas, { id: Date.now(), area: area.trim(), completedAt: new Date().toLocaleDateString() }],
        }));
    };
    const deleteCompletedStudyArea = (id) => {
        setState((prev) => ({
            ...prev,
            completedStudyAreas: prev.completedStudyAreas.filter((c) => c.id !== id),
        }));
    };
    // Tasks Actions
    const addTodo = (task, priority = 'Medium', date, time) => {
        if (!task.trim())
            return;
        setState((prev) => ({
            ...prev,
            todos: [
                { id: Date.now(), task: task.trim(), priority, date, time, completed: false },
                ...prev.todos,
            ],
        }));
    };
    const toggleTodo = (id, remarks) => {
        setState((prev) => ({
            ...prev,
            todos: prev.todos.map((t) => {
                if (t.id !== id)
                    return t;
                const nextCompleted = !t.completed;
                return {
                    ...t,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
                    completedRemarks: remarks !== undefined ? remarks : t.completedRemarks,
                };
            }),
        }));
    };
    const deleteTodo = (id) => {
        setState((prev) => ({
            ...prev,
            todos: prev.todos.filter((t) => t.id !== id),
        }));
    };
    const moveTodo = (id, direction) => {
        setState((prev) => {
            const idx = prev.todos.findIndex((t) => t.id === id);
            if (idx === -1)
                return prev;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= prev.todos.length)
                return prev;
            const newTodos = [...prev.todos];
            const item = newTodos.splice(idx, 1)[0];
            newTodos.splice(targetIdx, 0, item);
            return { ...prev, todos: newTodos };
        });
    };
    const addFinishingTodo = (task, date, time) => {
        if (!task.trim())
            return;
        setState((prev) => ({
            ...prev,
            finishingTodos: [{ id: Date.now(), task: task.trim(), date, time, completed: false }, ...prev.finishingTodos],
        }));
    };
    const toggleFinishingTodo = (id, remarks) => {
        setState((prev) => ({
            ...prev,
            finishingTodos: prev.finishingTodos.map((t) => {
                if (t.id !== id)
                    return t;
                const nextCompleted = !t.completed;
                return {
                    ...t,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
                    completedRemarks: remarks !== undefined ? remarks : t.completedRemarks,
                };
            }),
        }));
    };
    const deleteFinishingTodo = (id) => {
        setState((prev) => ({
            ...prev,
            finishingTodos: prev.finishingTodos.filter((t) => t.id !== id),
        }));
    };
    const addGeneralTodo = (task, date, time) => {
        if (!task.trim())
            return;
        setState((prev) => ({
            ...prev,
            generalTodos: [{ id: Date.now(), task: task.trim(), date, time, completed: false }, ...prev.generalTodos],
        }));
    };
    const toggleGeneralTodo = (id, remarks) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        toggleRoutineForDate(id, todayStr);
    };
    const toggleRoutineForDate = (id, dateStr) => {
        setState((prev) => ({
            ...prev,
            generalTodos: prev.generalTodos.map((t) => {
                if (t.id !== id)
                    return t;
                const currentDates = t.completedDates || (t.completed && t.date ? [t.date] : []);
                const isDone = currentDates.includes(dateStr);
                const nextDates = isDone
                    ? currentDates.filter((d) => d !== dateStr)
                    : [...currentDates, dateStr];
                const todayStr = new Date().toISOString().slice(0, 10);
                const isTodayDone = nextDates.includes(todayStr);
                return {
                    ...t,
                    completedDates: nextDates,
                    completed: isTodayDone,
                    completedAt: isDone ? undefined : new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                };
            }),
        }));
    };
    const deleteGeneralTodo = (id) => {
        setState((prev) => ({
            ...prev,
            generalTodos: prev.generalTodos.filter((t) => t.id !== id),
        }));
    };
    // Meetings & Books
    const addMeeting = (meeting) => {
        setState((prev) => ({
            ...prev,
            meetings: [...prev.meetings, { id: Date.now(), ...meeting, completed: false }],
        }));
    };
    const toggleMeeting = (id, remarks) => {
        setState((prev) => ({
            ...prev,
            meetings: prev.meetings.map((m) => {
                if (m.id !== id)
                    return m;
                const nextCompleted = !m.completed;
                return {
                    ...m,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
                    remarks: remarks !== undefined ? remarks : m.remarks,
                };
            }),
        }));
    };
    const deleteMeeting = (id) => {
        setState((prev) => ({
            ...prev,
            meetings: prev.meetings.filter((m) => m.id !== id),
        }));
    };
    const addBook = (title, totalPages, pagesRead = 0) => {
        if (!title.trim())
            return;
        const safeTotal = Math.max(1, Number(totalPages) || 100);
        const safeRead = Math.max(0, Number(pagesRead) || 0);
        const isCompleted = safeRead >= safeTotal;
        setState((prev) => ({
            ...prev,
            books: [
                ...prev.books,
                {
                    id: Date.now(),
                    title: title.trim(),
                    totalPages: safeTotal,
                    pagesRead: safeRead,
                    completed: isCompleted,
                    completedAt: isCompleted ? new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }) : undefined,
                },
            ],
        }));
    };
    const updateBookProgress = (id, pagesRead) => {
        setState((prev) => ({
            ...prev,
            books: prev.books.map((b) => {
                if (b.id !== id)
                    return b;
                const safePages = Math.max(0, Math.min(b.totalPages, Number(pagesRead) || 0));
                const isFinished = safePages >= b.totalPages;
                return {
                    ...b,
                    pagesRead: safePages,
                    completed: isFinished ? true : b.completed,
                    completedAt: isFinished && !b.completedAt
                        ? new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : b.completedAt,
                };
            }),
        }));
    };
    const toggleBookCompleted = (id) => {
        setState((prev) => ({
            ...prev,
            books: prev.books.map((b) => {
                if (b.id !== id)
                    return b;
                const nextCompleted = !b.completed;
                const currentRead = b.pagesRead || 0;
                return {
                    ...b,
                    completed: nextCompleted,
                    pagesRead: nextCompleted ? b.totalPages : (currentRead >= b.totalPages ? 0 : currentRead),
                    completedAt: nextCompleted
                        ? new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : undefined,
                };
            }),
        }));
    };
    const deleteBook = (id) => {
        setState((prev) => ({
            ...prev,
            books: prev.books.filter((b) => b.id !== id),
        }));
    };
    // Extra
    const addProject = (title, type, deadline) => {
        if (!title.trim())
            return;
        setState((prev) => ({
            ...prev,
            projects: [{ id: Date.now(), title: title.trim(), type, deadline }, ...prev.projects],
        }));
    };
    const deleteProject = (id) => {
        setState((prev) => ({
            ...prev,
            projects: prev.projects.filter((p) => p.id !== id),
        }));
    };
    const addReel = (idea) => {
        if (!idea.trim())
            return;
        setState((prev) => ({
            ...prev,
            reels: [{ id: Date.now(), idea: idea.trim() }, ...prev.reels],
        }));
    };
    const deleteReel = (id) => {
        setState((prev) => ({
            ...prev,
            reels: prev.reels.filter((r) => r.id !== id),
        }));
    };
    const addTrainingClass = (topic, audience) => {
        if (!topic.trim())
            return;
        setState((prev) => ({
            ...prev,
            trainingClasses: [{ id: Date.now(), topic: topic.trim(), audience: audience.trim() }, ...prev.trainingClasses],
        }));
    };
    const deleteTrainingClass = (id) => {
        setState((prev) => ({
            ...prev,
            trainingClasses: prev.trainingClasses.filter((t) => t.id !== id),
        }));
    };
    // Design Studio
    const addDesignProject = (project) => {
        setState((prev) => ({
            ...prev,
            designProjects: [{ id: Date.now(), ...project }, ...prev.designProjects],
        }));
    };
    const updateDesignStatus = (id, status) => {
        setState((prev) => ({
            ...prev,
            designProjects: prev.designProjects.map((d) => (d.id === id ? { ...d, status } : d)),
        }));
    };
    const deleteDesignProject = (id) => {
        setState((prev) => ({
            ...prev,
            designProjects: prev.designProjects.filter((d) => d.id !== id),
        }));
    };
    const addDesignClient = (name, phone, notes) => {
        if (!name.trim())
            return;
        setState((prev) => ({
            ...prev,
            designClients: [{ id: Date.now(), name: name.trim(), phone: phone.trim(), notes: notes.trim() }, ...prev.designClients],
        }));
    };
    const deleteDesignClient = (id) => {
        setState((prev) => ({
            ...prev,
            designClients: prev.designClients.filter((c) => c.id !== id),
        }));
    };
    // Finance Actions
    const addReceivable = (name, amount, date) => {
        if (!name.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                receivables: [{ id: Date.now(), name: name.trim(), amount: Number(amount), date, completed: false }, ...prev.finance.receivables],
            },
        }));
    };
    const toggleReceivable = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                receivables: prev.finance.receivables.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
            },
        }));
    };
    const deleteReceivable = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                receivables: prev.finance.receivables.filter((r) => r.id !== id),
            },
        }));
    };
    const addPayable = (name, amount, date) => {
        if (!name.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                payables: [{ id: Date.now(), name: name.trim(), amount: Number(amount), date, completed: false }, ...prev.finance.payables],
            },
        }));
    };
    const togglePayable = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                payables: prev.finance.payables.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)),
            },
        }));
    };
    const deletePayable = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                payables: prev.finance.payables.filter((p) => p.id !== id),
            },
        }));
    };
    const addSaving = (name, amount) => {
        if (!name.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                savings: [...prev.finance.savings, { id: Date.now(), name: name.trim(), amount: Number(amount) }],
            },
        }));
    };
    const deleteSaving = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                savings: prev.finance.savings.filter((s) => s.id !== id),
            },
        }));
    };
    const addNeed = (name, amount) => {
        if (!name.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                needs: [...prev.finance.needs, { id: Date.now(), name: name.trim(), amount: Number(amount), completed: false }],
            },
        }));
    };
    const toggleNeed = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                needs: prev.finance.needs.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n)),
            },
        }));
    };
    const deleteNeed = (id) => {
        setState((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                needs: prev.finance.needs.filter((n) => n.id !== id),
            },
        }));
    };
    const updateBankDetails = (details) => {
        setState((prev) => {
            const merged = { ...prev.finance.bankDetails, ...details };
            // Regenerate QR if upiId or accName changed and not custom data url
            if ((details.upiId || details.accName) && (!merged.qrCode || merged.qrCode.includes('api.qrserver.com'))) {
                merged.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(merged.upiId)}&pn=${encodeURIComponent(merged.accName)}`;
            }
            return {
                ...prev,
                finance: { ...prev.finance, bankDetails: merged },
            };
        });
    };
    // Travels & Events
    const addTravel = (destination, date, budget) => {
        if (!destination.trim() || isNaN(budget))
            return;
        setState((prev) => ({
            ...prev,
            travels: [{ id: Date.now(), destination: destination.trim(), date, budget: Number(budget), expenses: [] }, ...prev.travels],
        }));
    };
    const deleteTravel = (id) => {
        setState((prev) => ({
            ...prev,
            travels: prev.travels.filter((t) => t.id !== id),
        }));
    };
    const addTravelExpense = (travelId, desc, amount) => {
        if (!desc.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            travels: prev.travels.map((t) => t.id === travelId ? { ...t, expenses: [...t.expenses, { id: Date.now(), desc: desc.trim(), amount: Number(amount) }] } : t),
        }));
    };
    const toggleTravel = (id, remarks) => {
        setState((prev) => ({
            ...prev,
            travels: prev.travels.map((t) => {
                if (t.id !== id)
                    return t;
                const nextCompleted = !t.completed;
                return {
                    ...t,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
                    remarks: remarks !== undefined ? remarks : t.remarks,
                };
            }),
        }));
    };
    const deleteTravelExpense = (travelId, expId) => {
        setState((prev) => ({
            ...prev,
            travels: prev.travels.map((t) => t.id === travelId ? { ...t, expenses: t.expenses.filter((e) => e.id !== expId) } : t),
        }));
    };
    const addEvent = (title, concept, date) => {
        if (!title.trim())
            return;
        setState((prev) => ({
            ...prev,
            events: [{ id: Date.now(), title: title.trim(), concept: concept.trim(), date, income: [], expense: [], completed: false }, ...prev.events],
        }));
    };
    const toggleEvent = (id, remarks) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => {
                if (e.id !== id)
                    return e;
                const nextCompleted = !e.completed;
                return {
                    ...e,
                    completed: nextCompleted,
                    completedAt: nextCompleted ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : undefined,
                    remarks: remarks !== undefined ? remarks : e.remarks,
                };
            }),
        }));
    };
    const deleteEvent = (id) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.filter((e) => e.id !== id),
        }));
    };
    const addEventIncome = (eventId, desc, amount) => {
        if (!desc.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => e.id === eventId ? { ...e, income: [...e.income, { id: Date.now(), desc: desc.trim(), amount: Number(amount) }] } : e),
        }));
    };
    const deleteEventIncome = (eventId, incId) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => e.id === eventId ? { ...e, income: e.income.filter((i) => i.id !== incId) } : e),
        }));
    };
    const addEventExpense = (eventId, desc, amount) => {
        if (!desc.trim() || isNaN(amount))
            return;
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => e.id === eventId ? { ...e, expense: [...e.expense, { id: Date.now(), desc: desc.trim(), amount: Number(amount) }] } : e),
        }));
    };
    const deleteEventExpense = (eventId, expId) => {
        setState((prev) => ({
            ...prev,
            events: prev.events.map((e) => e.id === eventId ? { ...e, expense: e.expense.filter((x) => x.id !== expId) } : e),
        }));
    };
    // Orbit & Vault
    const addFamilyMember = (relation, phone, freq) => {
        if (!relation.trim())
            return;
        setState((prev) => ({
            ...prev,
            family: [...prev.family, { id: Date.now(), relation: relation.trim(), phone: phone.trim(), freq, lastCalled: 'Never' }],
        }));
    };
    const deleteFamilyMember = (id) => {
        setState((prev) => ({
            ...prev,
            family: prev.family.filter((f) => f.id !== id),
        }));
    };
    const logFamilyCall = (id) => {
        const member = state.family.find((f) => f.id === id);
        const dateStr = new Date().toISOString().slice(0, 10);
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        logFamilyCallWithDetails(id, dateStr, timeStr, 'Direct call logged');
    };
    const logFamilyCallWithDetails = (contactId, date, time, remarks) => {
        setState((prev) => {
            const member = prev.family.find((f) => f.id === contactId);
            const newLog = {
                id: Date.now(),
                contactId,
                relation: member?.relation || 'Contact',
                phone: member?.phone || '',
                date,
                time,
                remarks: remarks.trim() || 'Call completed.',
            };
            return {
                ...prev,
                family: prev.family.map((f) => (f.id === contactId ? { ...f, lastCalled: `${date} ${time}` } : f)),
                callLogs: [newLog, ...(prev.callLogs || [])],
            };
        });
    };
    const deleteCallLog = (id) => {
        setState((prev) => ({
            ...prev,
            callLogs: (prev.callLogs || []).filter((c) => c.id !== id),
        }));
    };
    const addVaultDocument = (name, number, image = null) => {
        if (!name.trim() || !number.trim())
            return;
        setState((prev) => ({
            ...prev,
            myself: {
                ...prev.myself,
                documents: [...prev.myself.documents, { id: Date.now(), name: name.trim(), number: number.trim(), image }],
            },
        }));
    };
    const deleteVaultDocument = (id) => {
        setState((prev) => ({
            ...prev,
            myself: {
                ...prev.myself,
                documents: prev.myself.documents.filter((d) => d.id !== id),
            },
        }));
    };
    const updateVaultDocumentImage = (id, image) => {
        setState((prev) => ({
            ...prev,
            myself: {
                ...prev.myself,
                documents: prev.myself.documents.map((d) => (d.id === id ? { ...d, image } : d)),
            },
        }));
    };
    // Personal Journal / Diary Handlers
    const addJournalEntry = (entry) => {
        const newEntry = {
            ...entry,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        };
        setState((prev) => ({
            ...prev,
            journalEntries: [newEntry, ...(prev.journalEntries || [])],
        }));
    };
    const updateJournalEntry = (id, entry) => {
        setState((prev) => ({
            ...prev,
            journalEntries: (prev.journalEntries || []).map((j) => j.id === id ? { ...j, ...entry } : j),
        }));
    };
    const deleteJournalEntry = (id) => {
        setState((prev) => ({
            ...prev,
            journalEntries: (prev.journalEntries || []).filter((j) => j.id !== id),
        }));
    };
    // Gemini Session Management
    const createGeminiSession = () => {
        const newId = Date.now();
        const newSession = {
            id: newId,
            title: 'New Session',
            messages: [
                {
                    role: 'model',
                    text: 'New chat session started! Ask me anything about your studies, finances, tasks, or request advice.',
                },
            ],
        };
        setState((prev) => ({
            ...prev,
            geminiSessions: [newSession, ...prev.geminiSessions],
        }));
        setCurrentGeminiSessionId(newId);
        return newId;
    };
    const deleteGeminiSession = (id) => {
        setState((prev) => {
            const remaining = prev.geminiSessions.filter((s) => s.id !== id);
            if (remaining.length === 0) {
                const fallback = { id: Date.now(), title: 'General Chat', messages: [] };
                setCurrentGeminiSessionId(fallback.id);
                return { ...prev, geminiSessions: [fallback] };
            }
            if (currentGeminiSessionId === id) {
                setCurrentGeminiSessionId(remaining[0].id);
            }
            return { ...prev, geminiSessions: remaining };
        });
    };
    const addChatMessage = (sessionId, message) => {
        setState((prev) => ({
            ...prev,
            geminiSessions: prev.geminiSessions.map((s) => {
                if (s.id !== sessionId)
                    return s;
                const newMessages = [...s.messages, message];
                let newTitle = s.title;
                if (s.title === 'New Session' && message.role === 'user') {
                    newTitle = message.text.slice(0, 24) + (message.text.length > 24 ? '...' : '');
                }
                return {
                    ...s,
                    title: newTitle,
                    messages: newMessages,
                };
            }),
        }));
    };
    const clearSessionMessages = (sessionId) => {
        setState((prev) => ({
            ...prev,
            geminiSessions: prev.geminiSessions.map((s) => s.id === sessionId ? { ...s, messages: [] } : s),
        }));
    };
    const dismissAlarm = () => setActiveAlarm(null);
    const exportJSONBackup = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `PK_Workspace_Backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };
    const importJSONBackup = (jsonData) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (parsed && typeof parsed === 'object') {
                setState({ ...INITIAL_STATE, ...parsed });
                return true;
            }
        }
        catch (e) {
            console.error('Failed to parse JSON backup', e);
        }
        return false;
    };
    const resetToDefaults = () => {
        if (window.confirm('Reset all workspace data to original defaults? Any custom added items will be refreshed.')) {
            setState(INITIAL_STATE);
        }
    };
    return (<WorkspaceContext.Provider value={{
            state,
            updateState,
            updateProfile,
            addStudyTrack,
            toggleStudyTrack,
            updateStudyTrackProgress,
            deleteStudyTrack,
            addStudyTrackModule,
            toggleStudyTrackModule,
            deleteStudyTrackModule,
            addExam,
            toggleExamStatus,
            deleteExam,
            addPastQualification,
            deletePastQualification,
            addCompletedStudyArea,
            deleteCompletedStudyArea,
            addTodo,
            toggleTodo,
            deleteTodo,
            moveTodo,
            addFinishingTodo,
            toggleFinishingTodo,
            deleteFinishingTodo,
            addGeneralTodo,
            toggleGeneralTodo,
            toggleRoutineForDate,
            deleteGeneralTodo,
            addMeeting,
            toggleMeeting,
            deleteMeeting,
            addBook,
            updateBookProgress,
            toggleBookCompleted,
            deleteBook,
            addProject,
            deleteProject,
            addReel,
            deleteReel,
            addTrainingClass,
            deleteTrainingClass,
            addDesignProject,
            updateDesignStatus,
            deleteDesignProject,
            addDesignClient,
            deleteDesignClient,
            addReceivable,
            toggleReceivable,
            deleteReceivable,
            addPayable,
            togglePayable,
            deletePayable,
            addSaving,
            deleteSaving,
            addNeed,
            toggleNeed,
            deleteNeed,
            updateBankDetails,
            addTravel,
            toggleTravel,
            deleteTravel,
            addTravelExpense,
            deleteTravelExpense,
            addEvent,
            toggleEvent,
            deleteEvent,
            addEventIncome,
            deleteEventIncome,
            addEventExpense,
            deleteEventExpense,
            addFamilyMember,
            deleteFamilyMember,
            logFamilyCall,
            logFamilyCallWithDetails,
            deleteCallLog,
            addVaultDocument,
            deleteVaultDocument,
            updateVaultDocumentImage,
            addJournalEntry,
            updateJournalEntry,
            deleteJournalEntry,
            currentGeminiSessionId,
            setCurrentGeminiSessionId,
            createGeminiSession,
            deleteGeminiSession,
            addChatMessage,
            clearSessionMessages,
            activeAlarm,
            dismissAlarm,
            exportJSONBackup,
            importJSONBackup,
            resetToDefaults,
            calculatedAge,
            netFinanceAvailable,
            mongoStatus,
            refreshMongoStatus,
            syncNowWithDatabase,
        }}>
      {children}
    </WorkspaceContext.Provider>);
}
export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
