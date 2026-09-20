export interface TeamMemberDetails {
  role: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
}

export interface RegistrationEmailPayload {
  leaderName: string;
  leaderEmail: string;
  leaderPhone?: string;
  organization?: string;
  teamName: string;
  track: string;
  problemStatementId?: number;
  problemStatementTitle?: string;
  pptLink?: string;
  teamSize: number;
  referralCode: string;
  registrationDate: string;
  members?: TeamMemberDetails[];
  websiteUrl?: string;
  contactEmail?: string;
}

/**
 * Generates an ultra-cool, modern, high-tech HTML email template matching YODHA 2.0 branding.
 * Uses inline styles & bulletproof table layouts for 100% compatibility across Gmail, Outlook, Apple Mail, and Mobile.
 */
export function generateEmailTemplate(data: RegistrationEmailPayload): string {
  const websiteUrl = "https://yodha.aidajecc.in";

  const contactEmail =
    data.contactEmail ||
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CONTACT_EMAIL) ||
    (typeof process !== "undefined" && process.env?.VITE_CONTACT_EMAIL) ||
    "yodha@jecc.ac.in";

  const bannerUrl =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_BANNER_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_BANNER_URL) ||
    "https://res.cloudinary.com/dgtkvydpk/image/upload/v1789316647/poster_c8hecc.jpg";

  const escapeHtml = (value: unknown): string =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const e = escapeHtml;

  const cleanBaseUrl = websiteUrl.replace(/\/+$/, "");
  const safeWebsiteUrl = e(cleanBaseUrl);
  const safeContactEmail = e(contactEmail);
  const safeReferralCode = e((data.referralCode || "YODHA-2026").toUpperCase().trim());

  const referralTarget = `${cleanBaseUrl}/register?ref=${encodeURIComponent(data.referralCode)}`;
  const dashboardTarget = `${cleanBaseUrl}/?view_ref=${encodeURIComponent(data.referralCode)}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `🚀 Join YODHA 2.0 – Warriors of AI!\n\nUse my Warrior Referral Code: ${data.referralCode}\n\nRegister your team here: ${referralTarget}`
  )}`;

  const emailShareUrl = `mailto:?subject=${encodeURIComponent(
    "Invitation: Join YODHA 2.0 – Warriors of AI"
  )}&body=${encodeURIComponent(
    `Hey Cyber Warrior,\n\nWe are building the future at YODHA 2.0 – Warriors of AI Hackathon.\n\nUse my official Warrior Referral Code: ${data.referralCode}\n\nRegister your team here:\n${referralTarget}\n\nSee you on the leaderboard!`
  )}`;

  const membersHtml = (data.members || []).map((m, index) => `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; background-color: #090e21; border: 1px solid #1e293b; border-radius: 14px;">
      <tr>
        <td style="padding: 14px 16px;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="36" valign="top">
                <div style="width: 32px; height: 32px; border-radius: 8px; background-color: #0f172a; border: 1px solid #38bdf8; color: #38bdf8; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 30px; text-align: center;">
                  ${String(index + 1).padStart(2, "0")}
                </div>
              </td>
              <td style="padding-left: 12px;" valign="top">
                <div style="font-size: 10px; font-family: monospace; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                  ${e(m.role || `WARRIOR #${index + 1}`)}
                </div>
                <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px;">
                  ${e(m.fullName)}
                </div>
                <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 4px; line-height: 1.5;">
                  ${m.email ? `✉️ ${e(m.email)}` : ""}
                  ${m.phone ? `<span style="color: #475569;"> &nbsp;|&nbsp; </span>📞 ${e(m.phone)}` : ""}
                  ${m.organization ? `<span style="color: #475569;"> &nbsp;|&nbsp; </span>🏛️ ${e(m.organization)}` : ""}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>YODHA 2.0 — Registration Confirmed</title>
<style>
  body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #030611; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
  table { border-collapse: collapse !important; table-layout: fixed; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  a { text-decoration: none; }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; padding-left: 10px !important; padding-right: 10px !important; }
    .content-box { padding: 20px 16px !important; }
    .title-text { font-size: 26px !important; }
    .grid-col { width: 100% !important; display: block !important; }
    .code-text { font-size: 24px !important; letter-spacing: 3px !important; }
  }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #030611; color: #e2e8f0;">

  <!-- OUTER BACKGROUND WRAPPER -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030611; padding: 24px 0 40px;">
    <tr>
      <td align="center">

        <!-- MAIN EMAIL CARD CONTAINER (MAX 640PX) -->
        <table role="presentation" class="container" width="640" border="0" cellspacing="0" cellpadding="0" style="width: 640px; max-width: 640px; background-color: #050a1c; border: 1px solid #1e293b; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 40px rgba(59,130,246,0.15);">
          
          <!-- TOP NEON GLOW ACCENT BAR -->
          <tr>
            <td height="4" style="height: 4px; background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #fbbf24 100%);"></td>
          </tr>

          <!-- HEADER BANNER IMAGE -->
          <tr>
            <td style="padding: 0; background-color: #000000;">
              <a href="${safeWebsiteUrl}" target="_blank" style="display: block;">
                <img src="${bannerUrl}" alt="YODHA 2.0 Banner" width="640" style="width: 100%; max-width: 640px; height: auto; display: block; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- HERO INTRO SECTION -->
          <tr>
            <td class="content-box" style="padding: 32px 36px 24px; background: radial-gradient(circle at 50% 0%, rgba(59,130,246,0.15), transparent 70%);">
              
              <!-- VERIFIED BADGE -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 6px 14px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 20px; font-family: monospace; font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1.5px;">
                    ✓ REGISTRATION CONFIRMED • ENTRY VERIFIED
                  </td>
                </tr>
              </table>

              <!-- HEADING -->
              <div style="font-family: monospace; font-size: 11px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 6px;">
                YODHA 2.0 • WARRIORS OF AI
              </div>
              <h1 class="title-text" style="margin: 0 0 14px; font-size: 32px; font-weight: 900; color: #ffffff; line-height: 1.15; tracking-tight: true;">
                Welcome to the <span style="color: #38bdf8;">YODHA Arena</span>, ${e(data.leaderName)}!
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5e1;">
                Greetings Captain! Your team <strong style="color: #ffffff; font-size: 15px;">"${e(data.teamName)}"</strong> has officially secured its registration for <strong>YODHA 2.0 – Warriors of AI</strong>. Below is your official squad dossier, submitted presentation link, and your personal Warrior Referral Code.
              </p>
            </td>
          </tr>

          <!-- SECTION 01: SQUAD DOSSIER -->
          <tr>
            <td class="content-box" style="padding: 0 36px 28px;">
              
              <!-- SECTION HEADER -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                <tr>
                  <td style="font-family: monospace; font-size: 11px; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">
                    📋 01 • SQUAD REGISTRATION DOSSIER
                  </td>
                </tr>
              </table>

              <!-- DOSSIER CARD GRID -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="grid-col" width="50%" valign="top" style="padding-right: 6px; padding-bottom: 12px;">
                    <div style="background-color: #090e21; border: 1px solid #1e293b; border-radius: 14px; padding: 14px 16px; min-height: 80px;">
                      <div style="font-family: monospace; font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase;">TEAM CAPTAIN (LEADER)</div>
                      <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 4px;">${e(data.leaderName)}</div>
                      <div style="font-size: 11px; color: #38bdf8; font-family: monospace; margin-top: 2px;">✉️ ${e(data.leaderEmail)}</div>
                    </div>
                  </td>
                  <td class="grid-col" width="50%" valign="top" style="padding-left: 6px; padding-bottom: 12px;">
                    <div style="background-color: #090e21; border: 1px solid #1e293b; border-radius: 14px; padding: 14px 16px; min-height: 80px;">
                      <div style="font-family: monospace; font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase;">SQUAD NAME</div>
                      <div style="font-size: 15px; font-weight: 800; color: #38bdf8; margin-top: 4px;">${e(data.teamName)}</div>
                      <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 2px;">👥 ${data.teamSize} Registered Warriors</div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td class="grid-col" width="50%" valign="top" style="padding-right: 6px; padding-bottom: 12px;">
                    <div style="background-color: #090e21; border: 1px solid #1e293b; border-radius: 14px; padding: 14px 16px; min-height: 80px;">
                      <div style="font-family: monospace; font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase;">CHOSEN TRACK</div>
                      <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-top: 4px;">${e(data.track)}</div>
                      <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 2px;">📅 Registered: ${e(data.registrationDate)}</div>
                    </div>
                  </td>
                  <td class="grid-col" width="50%" valign="top" style="padding-left: 6px; padding-bottom: 12px;">
                    <div style="background-color: #090e21; border: 1px solid #1e293b; border-radius: 14px; padding: 14px 16px; min-height: 80px;">
                      <div style="font-family: monospace; font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase;">COLLEGE / INSTITUTION</div>
                      <div style="font-size: 13px; font-weight: 800; color: #ffffff; margin-top: 4px;">${e(data.organization || "N/A")}</div>
                      <div style="font-size: 11px; color: #34d399; font-family: monospace; margin-top: 2px;">✓ Verified Roster</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- PROBLEM STATEMENT & PPT LINK BOX -->
              ${data.problemStatementTitle ? `
              <div style="margin-top: 4px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(11, 31, 61, 0.9)); border: 1px solid #2563eb; border-radius: 16px; padding: 18px;">
                <div style="font-family: monospace; font-size: 10px; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
                  🎯 SUBMITTED PROBLEM STATEMENT ${data.problemStatementId ? `[ID #${data.problemStatementId}]` : ""}
                </div>
                <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 6px; line-height: 1.4;">
                  ${e(data.problemStatementTitle)}
                </div>
                ${data.pptLink ? `
                <div style="margin-top: 14px;">
                  <a href="${e(data.pptLink)}" target="_blank" style="display: inline-block; padding: 10px 18px; background-color: #2563eb; border-radius: 10px; font-family: monospace; font-size: 11px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
                    📁 OPEN SUBMITTED PPT PRESENTATION LINK ↗
                  </a>
                </div>
                ` : ""}
              </div>
              ` : ""}

            </td>
          </tr>

          <!-- SECTION 02: WARRIOR REFERRAL ADVANTAGE & DASHBOARD LINK -->
          <tr>
            <td class="content-box" style="padding: 0 36px 32px;">
              
              <div style="background: linear-gradient(135deg, #171203 0%, #0d0b03 100%); border: 1.5px solid #fbbf24; border-radius: 20px; padding: 24px; box-shadow: 0 0 30px rgba(251, 191, 36, 0.15);">
                
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <div style="font-family: monospace; font-size: 11px; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 2px;">
                        🛡️ 02 • YOUR WARRIOR REFERRAL ADVANTAGE
                      </div>
                      <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 6px;">
                        Refer Teams & View Live Referral Roster
                      </div>
                      <p style="font-size: 13px; color: #fef08a; line-height: 1.6; margin: 8px 0 16px;">
                        Share your unique referral code with fellow innovators! Teams must have at least 2 valid referred teams to qualify, and the shortlisted team with the highest number of valid referrals will receive a special gift.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- REFERRAL CODE DISPLAY BOX -->
                <div style="background-color: #05070e; border: 1px dashed #fbbf24; border-radius: 14px; padding: 16px; text-align: center; margin-bottom: 16px;">
                  <div style="font-family: monospace; font-size: 9px; color: #a18029; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                    YOUR WARRIOR REFERRAL CODE
                  </div>
                  <div class="code-text" style="font-family: monospace; font-size: 32px; font-weight: 900; color: #fbbf24; letter-spacing: 5px; margin-top: 4px; text-shadow: 0 0 15px rgba(251, 191, 36, 0.4);">
                    ${safeReferralCode}
                  </div>
                </div>

                <!-- LIVE REFERRAL DASHBOARD LINK BUTTON (PRIMARY ACTION FOR REFERRER) -->
                <div style="margin-bottom: 14px; text-align: center;">
                  <a href="${dashboardTarget}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; padding: 14px; background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%); border: 1px solid #60a5fa; border-radius: 12px; font-family: monospace; font-size: 12px; font-weight: 900; color: #ffffff; text-align: center; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);">
                    📊 VIEW MY REFERRAL ROOM (SEE REFERRED TEAMS) ↗
                  </a>
                  <div style="margin-top: 8px; font-family: monospace; font-size: 11px; color: #60a5fa; word-break: break-all;">
                    Direct Room Link: <a href="${dashboardTarget}" target="_blank" style="color: #93c5fd; text-decoration: underline;">${dashboardTarget}</a>
                  </div>
                </div>

                <!-- SHARE BUTTONS GRID -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="grid-col" width="50%" style="padding-right: 4px; padding-bottom: 6px;">
                      <a href="${whatsappShareUrl}" target="_blank" style="display: block; padding: 12px 10px; background-color: #0f172a; border: 1px solid #3b82f6; border-radius: 10px; font-family: monospace; font-size: 11px; font-weight: 800; color: #60a5fa; text-align: center; text-transform: uppercase;">
                        💬 SHARE ON WHATSAPP ↗
                      </a>
                    </td>
                    <td class="grid-col" width="50%" style="padding-left: 4px; padding-bottom: 6px;">
                      <a href="${emailShareUrl}" style="display: block; padding: 12px 10px; background-color: #0f172a; border: 1px solid #64748b; border-radius: 10px; font-family: monospace; font-size: 11px; font-weight: 800; color: #e2e8f0; text-align: center; text-transform: uppercase;">
                        ✉️ SHARE VIA EMAIL ↗
                      </a>
                    </td>
                  </tr>
                </table>

              </div>

            </td>
          </tr>

          <!-- SECTION 03: SQUAD ROSTER -->
          <tr>
            <td class="content-box" style="padding: 0 36px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                <tr>
                  <td style="font-family: monospace; font-size: 11px; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">
                    👥 03 • REGISTERED SQUAD ROSTER
                  </td>
                </tr>
              </table>

              ${membersHtml}
            </td>
          </tr>

          <!-- SECTION 04: MISSION ROADMAP -->
          <tr>
            <td class="content-box" style="padding: 0 36px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                <tr>
                  <td style="font-family: monospace; font-size: 11px; font-weight: 900; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px;">
                    🚀 04 • HACKATHON ROADMAP & NEXT STEPS
                  </td>
                </tr>
              </table>

              <div style="background-color: #090e21; border: 1px solid #1e293b; border-radius: 16px; padding: 18px 20px;">
                
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                  <tr>
                    <td width="28" valign="top">
                      <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2563eb; color: #ffffff; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 22px; text-align: center;">1</div>
                    </td>
                    <td style="padding-left: 10px;">
                      <div style="font-size: 13px; font-weight: 800; color: #ffffff;">Technical Verification & Evaluation</div>
                      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Organizing committee reviews your problem statement PPT deck and team submission.</div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                  <tr>
                    <td width="28" valign="top">
                      <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2563eb; color: #ffffff; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 22px; text-align: center;">2</div>
                    </td>
                    <td style="padding-left: 10px;">
                      <div style="font-size: 13px; font-weight: 800; color: #ffffff;">Shortlisting Announcement</div>
                      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Shortlisted teams receive official confirmation and portal updates.</div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="28" valign="top">
                      <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2563eb; color: #ffffff; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 22px; text-align: center;">3</div>
                    </td>
                    <td style="padding-left: 10px;">
                      <div style="font-size: 13px; font-weight: 800; color: #ffffff;">YODHA Hackathon Day</div>
                      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Bring your AI innovation live into the arena and compete for the trophy!</div>
                    </td>
                  </tr>
                </table>

              </div>
            </td>
          </tr>

          <!-- FOOTER SECTION -->
          <tr>
            <td style="padding: 28px 36px; background-color: #02040c; border-top: 1px solid #1e293b; text-align: center;">
              
              <div style="font-size: 14px; font-weight: 900; color: #ffffff;">
                YODHA 2.0 HACKATHON COMMITTEE
              </div>
              <div style="font-family: monospace; font-size: 10px; color: #38bdf8; font-weight: 800; letter-spacing: 2px; margin-top: 4px; text-transform: uppercase;">
                WARRIORS OF AI • JYOTHI ENGINEERING COLLEGE
              </div>

              <div style="margin-top: 14px; font-size: 12px; color: #64748b; font-family: monospace;">
                Portal: <a href="${safeWebsiteUrl}" target="_blank" style="color: #67e8f9; text-decoration: underline;">yodha.aidajecc.in</a>
                <span style="color: #334155;"> &nbsp;•&nbsp; </span>
                Contact: <a href="mailto:${safeContactEmail}" style="color: #67e8f9; text-decoration: underline;">${safeContactEmail}</a>
              </div>

              <div style="margin-top: 16px; font-size: 10px; color: #475569; line-height: 1.5;">
                This is an automated operational confirmation generated by the YODHA 2.0 Portal.<br>Please retain this record for your hackathon entry verification.
              </div>

            </td>
          </tr>

        </table>
        <!-- END MAIN EMAIL CARD CONTAINER -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
