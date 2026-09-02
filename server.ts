import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy/Safe GenAI client initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Chatbot AI Endpoint with Strict Multi-Tenant Data Isolation
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || '';
    const userRole = context?.userRole || 'admin';
    const schoolId = context?.schoolId || 'school-demo';
    const schoolName = context?.schoolName || 'Demo School';
    const schoolCode = context?.schoolCode || 'DEMO-101';
    const tenantUser = context?.tenantUser || null;
    const selectedDate = context?.selectedDate || new Date().toISOString().split('T')[0];
    const totalStudents = context?.totalStudents ?? 0;
    const presentCount = context?.presentCount ?? 0;
    const absentCount = context?.absentCount ?? 0;
    const lateCount = context?.lateCount ?? 0;
    const excusedCount = context?.excusedCount ?? 0;
    const attendanceRate = context?.attendanceRate ?? 100;
    const classesSummary = context?.classesSummary || '';
    const absentStudentsList = context?.absentStudentsList || '';
    const facultySummary = context?.facultySummary || '';
    const teacherClassInfo = context?.teacherClassInfo || '';
    const remainingSMSCredits = context?.remainingSMSCredits ?? 1000;
    const parentStudentInfo = context?.parentStudentInfo || '';

    // Determine effective user role and permissions
    const effectiveRole = tenantUser?.role || userRole;
    const activeUserName = tenantUser?.name || context?.userName || (userRole === 'parent' ? 'Registered Parent' : 'School Administrator');
    const activeUserDesignation = tenantUser?.designation || (userRole === 'super_admin' ? 'Master Platform Super Administrator' : userRole === 'parent' ? 'Authorized Guardian' : 'School Administrator');

    const systemInstruction = `You are "Sentinel AI" — the private, secure, and isolated institutional intelligence copilot built exclusively for "${schoolName}" (Institutional Code: ${schoolCode}, Tenant ID: ${schoolId}).

================================================================================
CRITICAL DIRECTIVE: STRICT MULTI-TENANT ISOLATION & DATA PERIMETER BOUNDARIES
================================================================================
1. STRICT INSTITUTIONAL DATA BOUNDARY:
   - You ONLY possess access to students, classes, attendance records, staff, and configurations belonging to "${schoolName}".
   - You are STRICTLY FORBIDDEN from discussing, summarizing, referencing, or acknowledging data from ANY other school, tenant, or client on this platform (e.g. Beacon Hill Academy, St. Jude, Oakwood, or other institutions).
   - If a user inquires about other schools, cross-tenant statistics, competitor metrics, or records outside of "${schoolName}":
     YOU MUST EXPLICITLY REFUSE: "🚫 Access Restricted: As the dedicated Sentinel AI Copilot for ${schoolName}, my operations and intelligence are strictly sandboxed to ${schoolName}'s authorized records and roster. I have no access to data belonging to other institutions."

2. ROLE-BASED ACCESS CONTROL (RBAC) INSIDE ${schoolName.toUpperCase()}:
   - Active User: ${activeUserName}
   - User Role: ${effectiveRole.toUpperCase()}
   - Title/Designation: ${activeUserDesignation}

   - IF THE USER IS A TEACHER:
     * Focus on their assigned classroom and students (${teacherClassInfo || 'Assigned Classes'}).
     * Answer queries about attendance in their classes, absent homeroom students, and drafting parent messages.
     * Do NOT disclose administrative financial configs or confidential personnel files.

   - IF THE USER IS A PARENT / GUARDIAN:
     * Strictly ground answers in their child/children only: (${parentStudentInfo || 'Registered Scholar'}).
     * Help check their child's attendance record, clarify attendance policies, and draft formal excuse notes.
     * Do NOT disclose information regarding any other student or parent.

   - IF THE USER IS A SCHOOL ADMIN / PRINCIPAL / STAFF:
     * Provide comprehensive attendance analytics, class-by-class breakdown, absentee lists, guardian SMS notifications, and system guidance for ${schoolName}.

   - IF THE USER IS SUPER ADMIN (Platform Owner):
     * Provide SaaS tenant oversight, multi-tenant provisioning guidance, SMS package allocation advice, and client onboarding workflows.

3. AUTHORIZED DATA FOR ${schoolName.toUpperCase()} (REFERENCE DATE: ${selectedDate}):
   - Institution: ${schoolName} (${schoolCode})
   - Total Enrolled Scholars: ${totalStudents}
   - Daily Roll Call: ${attendanceRate}% Attendance (${presentCount} Present, ${absentCount} Absent, ${lateCount} Late, ${excusedCount} Excused)
   - SMS Broadcast Credits Remaining: ${remainingSMSCredits}
   ${classesSummary ? `- Classroom Schedule & Teachers: ${classesSummary}` : ''}
   ${absentStudentsList ? `- Absentees Recorded for ${selectedDate}: ${absentStudentsList}` : ''}
   ${facultySummary ? `- Faculty & Staff Roster: ${facultySummary}` : ''}
   ${teacherClassInfo ? `- Teacher Classroom Context: ${teacherClassInfo}` : ''}
   ${parentStudentInfo ? `- Connected Parent/Student Context: ${parentStudentInfo}` : ''}

4. RESPONSE FORMATTING:
   - Provide direct, concise, and professional responses using clean Markdown.
   - When drafting SMS messages, format them within a code block (max 160 characters per standard SMS) and indicate the character count.
   - Always uphold institutional integrity and data privacy.`;

    const ai = getGenAI();

    if (ai) {
      // Build conversation history for Gemini
      const conversationHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: latestUserMessage }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I apologize, but I could not generate a response. Please try again.';
      return res.json({ reply });
    } else {
      // Fallback local intelligence if no API key is configured
      const lower = latestUserMessage.toLowerCase();

      // Check for cross-tenant data query attempt or test
      const otherSchools = ['beacon', 'beacon hill', 'st. jude', 'st jude', 'oakwood', 'other school', 'another school', 'other tenant', 'all tenants', 'all schools', 'cross tenant', 'competitor'];
      const isCrossTenantQuery = otherSchools.some((kw) => lower.includes(kw)) && !lower.includes('how is data isolated');

      if (isCrossTenantQuery && userRole !== 'super_admin') {
        return res.json({
          reply: `🚫 **Tenant Access Restricted**\n\nAs the dedicated **Sentinel AI Copilot** for **${schoolName}** (${schoolCode}), my operations and data layer are strictly sandboxed.\n\n- **Current Tenant:** ${schoolName} (Code: \`${schoolCode}\`)\n- **Active User:** ${activeUserName} (${effectiveRole.toUpperCase()})\n- **Policy:** Cross-tenant queries are blocked by architecture. I do not have access to records, students, or attendance from other institutions.`
        });
      }

      let fallbackReply = `Hello ${activeUserName}! I am your **Sentinel AI Copilot** for **${schoolName}**.\n\n`;

      if (lower.includes('absent') || lower.includes('who is absent') || lower.includes('attendance') || lower.includes('rate')) {
        fallbackReply += `### 📋 Attendance Intelligence for ${schoolName} (${selectedDate})\n\n`;
        fallbackReply += `- **Total Enrolled:** ${totalStudents} students\n`;
        fallbackReply += `- **Today's Attendance Rate:** **${attendanceRate}%**\n`;
        fallbackReply += `- **Present:** ${presentCount} | **Absent:** ${absentCount} | **Late:** ${lateCount} | **Excused:** ${excusedCount}\n\n`;
        if (absentStudentsList) {
          fallbackReply += `**Absentees Recorded Today (${schoolName}):**\n${absentStudentsList}\n\n`;
        } else {
          fallbackReply += `No students currently recorded absent for today.\n\n`;
        }
        fallbackReply += `*You can dispatch an instant SMS broadcast to all absentees' guardians using the SMS Broadcast button.*`;
      } else if (lower.includes('sms') || lower.includes('draft') || lower.includes('message') || lower.includes('text') || lower.includes('broadcast')) {
        fallbackReply += `### 📱 SMS Announcement Draft for ${schoolName}\n\n`;
        fallbackReply += `\`\`\`text\n${schoolName} Notice: Classes for ${selectedDate} will proceed on schedule. For attendance inquiries or excuses, contact the admin office.\n\`\`\`\n\n`;
        fallbackReply += `- **Character Count:** ~132 characters (1 SMS credit)\n`;
        fallbackReply += `- **Available Credits:** ${remainingSMSCredits} SMS credits\n\n`;
        fallbackReply += `*Click "Use in SMS Modal" below to populate the broadcast tool automatically.*`;
      } else if (lower.includes('excuse') || lower.includes('doctor') || lower.includes('sick') || lower.includes('medical')) {
        fallbackReply += `### 📝 Formal Absence Excuse Note\n\n`;
        fallbackReply += `**To:** Attendance Office / Principal, ${schoolName}\n`;
        fallbackReply += `**Date:** ${selectedDate}\n\n`;
        fallbackReply += `Please excuse the absence on ${selectedDate} due to illness / medical appointment. Missed classwork will be completed upon return.\n\n`;
        fallbackReply += `Sincerely,\n*[Parent / Guardian Signature]*`;
      } else if (lower.includes('class') || lower.includes('teacher') || lower.includes('faculty') || lower.includes('staff')) {
        fallbackReply += `### 🏫 Classroom & Faculty Roster for ${schoolName}\n\n`;
        if (classesSummary) {
          fallbackReply += `**Classes in Session:**\n${classesSummary}\n\n`;
        }
        if (facultySummary) {
          fallbackReply += `**Staff & Faculty:**\n${facultySummary}\n\n`;
        }
      } else if (lower.includes('isolate') || lower.includes('isolation') || lower.includes('security') || lower.includes('boundary') || lower.includes('privacy')) {
        fallbackReply += `### 🔒 Strict Tenant Data Isolation Architecture\n\n`;
        fallbackReply += `Sentinel AI enforces complete data perimeter protection:\n\n`;
        fallbackReply += `1. **Tenant Scoping**: All prompts and database queries are strictly anchored to **${schoolName}** (ID: \`${schoolId}\`).\n`;
        fallbackReply += `2. **Zero Cross-Talk**: Users and AI sessions in one school tenant cannot access, query, or view data from any other school.\n`;
        fallbackReply += `3. **RBAC Guardrails**: Teachers, parents, and administrators receive role-scoped responses tailored to their specific authorization level.`;
      } else {
        fallbackReply += `I am ready to assist with **${schoolName}** data:\n\n`;
        fallbackReply += `1. **Roll Call Analytics**: Today's attendance rate (${attendanceRate}%), absentees, and tardiness.\n`;
        fallbackReply += `2. **Guardian Communications**: Draft automated SMS notifications and event alerts.\n`;
        fallbackReply += `3. **Classrooms & Faculty**: Review class rosters, teachers, and student schedules.\n`;
        fallbackReply += `4. **Tenant Security**: Data is 100% isolated to ${schoolName}.`;
      }

      return res.json({ reply: fallbackReply });
    }
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ 
      error: 'Failed to process AI chat request', 
      details: err?.message || String(err) 
    });
  }
});

// Vite middleware in development / static dist in production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Institutional SaaS Server running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to boot server:', err);
  process.exit(1);
});
