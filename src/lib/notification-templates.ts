export interface StatutoryTemplate {
  id: string;
  section: string;
  titleEn: string;
  titleHi: string;
  category: "Notice" | "Statutory" | "Payment" | "Hearing" | "R&R";
  bodyEn: string;
  bodyHi: string;
  statutoryRef: string;
  urgency: "high" | "normal";
}

export const STATUTORY_TEMPLATES: StatutoryTemplate[] = [
  {
    id: "TMPL-SEC11-NOTICE",
    section: "Section 11(1)",
    titleEn: "Preliminary Gazette Notification Notice",
    titleHi: "धारा 11(1) प्रारंभिक गजट अधिसूचना सूचना",
    category: "Statutory",
    urgency: "high",
    statutoryRef: "Section 11(1) of RFCTLARR Act, 2013",
    bodyEn:
      "Dear Shri/Smt {name}, please be informed that Preliminary Notification under Section 11(1) of RFCTLARR Act 2013 has been published for your land parcel Khasra No. {khasra} in Village {village} for project '{project}'. You are eligible to file any claims or objections under Section 15 within 60 days before the CALA / District Collector. Ref: Gazette Notif GZ/2026/1102. Helpline: 1800-11-2013.",
    bodyHi:
      "आदरणीय {name} जी, सूचित किया जाता है कि परियोजना '{project}' हेतु आपकी भूमि खसरा संख्या {khasra}, ग्राम {village} के लिए भूमि अधिग्रहण (RFCTLARR) अधिनियम 2013 की धारा 11(1) के तहत प्रारंभिक गजट अधिसूचना प्रकाशित कर दी गई है। आप धारा 15 के तहत 60 दिनों के भीतर जिला कलेक्टर / CALA के समक्ष अपनी आपत्ति दर्ज करा सकते हैं। संदर्भ: गजट सं. GZ/2026/1102. हेल्पलाइन: 1800-11-2013।",
  },
  {
    id: "TMPL-SEC15-HEARING",
    section: "Section 15(2)",
    titleEn: "Objection Personal Hearing Summons",
    titleHi: "धारा 15(2) आपत्ति व्यक्तिगत सुनवाई बुलावा",
    category: "Hearing",
    urgency: "high",
    statutoryRef: "Section 15(2) of RFCTLARR Act, 2013",
    bodyEn:
      "Notice of Hearing: Shri/Smt {name}, your objection regarding Khasra No. {khasra}, Village {village} has been listed for personal hearing before the Competent Authority (CALA / District Collector) on {date} at 11:00 AM at the District Collectorate Camp Office. Please bring your original Revenue Records (Khatauni/Jamabandi) and photo ID. Ref: OBJ-2026-SEC15.",
    bodyHi:
      "सुनवाई सूचना: {name} जी, ग्राम {village} स्थित खसरा सं. {khasra} से संबंधित आपकी आपत्ति की व्यक्तिगत सुनवाई सक्षम प्राधिकारी (CALA / जिला कलेक्टर) द्वारा दिनांक {date} को प्रातः 11:00 बजे कलेक्ट्रेट सभागार में निर्धारित की गई है। कृपया अपने मूल राजस्व अभिलेख (खतौनी/जमाबंदी) व पहचान पत्र सहित उपस्थित हों। संदर्भ: OBJ-2026-SEC15।",
  },
  {
    id: "TMPL-SEC19-DECLARATION",
    section: "Section 19(1)",
    titleEn: "Final Acquisition Declaration Notification",
    titleHi: "धारा 19(1) अंतिम अधिग्रहण घोषणा अधिसूचना",
    category: "Statutory",
    urgency: "high",
    statutoryRef: "Section 19(1) of RFCTLARR Act, 2013",
    bodyEn:
      "Important Notice: Shri/Smt {name}, Final Declaration under Section 19(1) has been approved by the Government for acquisition of {area} Ha in Khasra No. {khasra}, Village {village} for '{project}'. Rehabilitation & Resettlement Scheme has been sanctioned under Section 19(2). Joint demarcation schedule will be communicated shortly.",
    bodyHi:
      "महत्वपूर्ण सूचना: {name} जी, परियोजना '{project}' के निमित्त ग्राम {village} के खसरा संख्या {khasra} के {area} हेक्टेयर भू-भाग के अधिग्रहण हेतु धारा 19(1) की अंतिम घोषणा सरकार द्वारा अनुमोदित हो गई है। धारा 19(2) के तहत पुनर्वास व पुनर्व्यवस्थापन योजना स्वीकृत है। संयुक्त सीमांकन की तिथि शीघ्र प्रेषित की जाएगी।",
  },
  {
    id: "TMPL-SEC23-DBT-CREDIT",
    section: "Section 23/26",
    titleEn: "Compensation DBT Direct Credit Alert",
    titleHi: "धारा 23/26 प्रतिकर DBT बैंक खाता क्रेडिट अलर्ट",
    category: "Payment",
    urgency: "high",
    statutoryRef: "Sections 23, 26 & 30 of RFCTLARR Act, 2013",
    bodyEn:
      "GOVT OF INDIA — PFMS / TREASURY ALERT: Shri/Smt {name}, statutory land acquisition award of {amount} (including 100% Solatium & 12% Addl Market Value) for Khasra No. {khasra}, Village {village} has been approved and electronically queued for Direct Benefit Transfer (DBT) to your verified bank account via PFMS. Ref: AWD/CALA/2026/894.",
    bodyHi:
      "भारत सरकार — PFMS / कोषागार अलर्ट: {name} जी, ग्राम {village} के खसरा सं. {khasra} के लिए निर्धारित प्रतिकर अधिनिर्णय राशि {amount} (100% तोषण/Solatium व 12% अतिरिक्त बाजार मूल्य सहित) स्वीकृत कर आपके बैंक खाते में PFMS द्वारा सीधे DBT क्रेडिट हेतु प्रेषित कर दी गई है। संदर्भ: AWD/CALA/2026/894।",
  },
  {
    id: "TMPL-SEC31-RR-PACKAGE",
    section: "Section 31",
    titleEn: "R&R Package Allotment & Entitlement Grant",
    titleHi: "धारा 31 पुनर्वास एवं पुनर्व्यवस्थापन (R&R) आवंटन पत्र",
    category: "R&R",
    urgency: "normal",
    statutoryRef: "Section 31 & Second Schedule of RFCTLARR Act, 2013",
    bodyEn:
      "R&R Authority Notice: Shri/Smt {name}, under the Second Schedule of RFCTLARR Act 2013, your Rehabilitation & Resettlement (R&R) entitlement for Village {village} has been sanctioned: One-time Resettlement Allowance + Livelihood Skill Grant. Please contact the R&R Commissioner Office with reference RR/2026/{khasra} to collect your formal sanction order.",
    bodyHi:
      "पुनर्वास प्राधिकार सूचना: {name} जी, RFCTLARR अधिनियम 2013 की द्वितीय अनुसूची के तहत ग्राम {village} हेतु आपके परिवार का पुनर्वास व पुनर्व्यवस्थापन (R&R) पैकेज स्वीकृत कर दिया गया है: एकमुश्त पुनर्वास भत्ता + आजीविका संवर्धन अनुदान। औपचारिक स्वीकृति पत्र प्राप्त करने हेतु R&R आयुक्त कार्यालय से संपर्क करें। संदर्भ: RR/2026/{khasra}।",
  },
  {
    id: "TMPL-SEC4-SIA-COMMENCE",
    section: "Section 4",
    titleEn: "Social Impact Assessment (SIA) Consultation Notice",
    titleHi: "धारा 4 सामाजिक प्रभाव आकलन (SIA) परामर्श सूचना",
    category: "Notice",
    urgency: "normal",
    statutoryRef: "Section 4(1) of RFCTLARR Act, 2013",
    bodyEn:
      "Public Consultation Alert: Shri/Smt {name}, Social Impact Assessment (SIA) survey under Section 4 for '{project}' will commence in Village {village} on {date}. Gram Sabha consultation will be held at Panchayat Bhawan at 10:30 AM. Landowners of Khasra No. {khasra} are cordially invited to participate.",
    bodyHi:
      "जन परामर्श सूचना: {name} जी, परियोजना '{project}' हेतु ग्राम {village} में धारा 4 के अंतर्गत सामाजिक प्रभाव आकलन (SIA) सर्वेक्षण दिनांक {date} से प्रारंभ होगा। पंचायत भवन में प्रातः 10:30 बजे ग्राम सभा परामर्श आयोजित है। खसरा सं. {khasra} के भूस्वामियों से उपस्थिति का सादर अनुरोध है।",
  },
];

export function renderNotificationTemplate(
  template: StatutoryTemplate,
  vars: {
    name: string;
    khasra: string;
    village: string;
    project: string;
    amount?: string;
    area?: string;
    date?: string;
  },
  lang: "hi" | "en"
): string {
  let text = lang === "hi" ? template.bodyHi : template.bodyEn;
  text = text.replace(/\{name\}/g, vars.name || "Landowner");
  text = text.replace(/\{khasra\}/g, vars.khasra || "DEMO-Plot");
  text = text.replace(/\{village\}/g, vars.village || "Locality");
  text = text.replace(/\{project\}/g, vars.project || "Infrastructure Corridor");
  text = text.replace(/\{amount\}/g, vars.amount || "₹ 1,00,00,000");
  text = text.replace(/\{area\}/g, vars.area || "1.5");
  text = text.replace(/\{date\}/g, vars.date || "25 March 2026");
  return text;
}
