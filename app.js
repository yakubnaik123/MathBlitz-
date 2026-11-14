"use strict";

const $ = (id) => document.getElementById(id);
const state = {
  language: "en", topic: "addition", mode: "speed", running: false,
  timeLeft: 10, clock: null, answer: null, correct: 0, wrong: 0,
  skipped: 0, streak: 0, bestStreak: 0, sessionBest: 0, startedAt: 0,
  questionsShown: 0, locked: false
};

const translations = {
  en:{intro:"Build calculation speed, one small challenge at a time.",solved:"Questions solved",accuracy:"Accuracy",streak:"Best streak",choose:"Choose a topic",free:"100% Free",start:"Start practice",answer:"Your answer",ready:"Press Start practice when you're ready.",correct:"Correct! Next question.",wrong:"Not quite. Correct answer: ",skip:"Skip question →",timeup:"Time is up! Your results are ready.",speedHint:"You have 10 seconds for each question.",minuteHint:"You have 60 seconds to solve as many as you can.",sec:"sec",min:"sec",attempted:"Attempted",right:"Correct",wrongLabel:"Wrong",skipped:"Skipped",again:"Practise again",expired:"Time's up!",correctLabel:"correct"},
  te:{intro:"చిన్న చిన్న ఛాలెంజ్‌లతో లెక్కల వేగాన్ని పెంచుకోండి.",solved:"పూర్తి చేసిన ప్రశ్నలు",accuracy:"ఖచ్చితత్వం",streak:"ఉత్తమ వరుస",choose:"ఒక అంశాన్ని ఎంచుకోండి",free:"పూర్తిగా ఉచితం",start:"ప్రాక్టీస్ ప్రారంభించండి",answer:"మీ సమాధానం",ready:"ప్రారంభించడానికి బటన్ నొక్కండి.",correct:"సరైన సమాధానం! తర్వాతి ప్రశ్న.",wrong:"సరైంది కాదు. సరైన సమాధానం: ",skip:"తర్వాతి ప్రశ్న →",timeup:"సమయం అయింది! ఫలితాలు సిద్ధంగా ఉన్నాయి.",speedHint:"ప్రతి ప్రశ్నకు 10 సెకన్లు.",minuteHint:"60 సెకన్లలో వీలైనన్ని ప్రశ్నలు చేయండి.",sec:"సెక.",min:"సెక.",attempted:"ప్రయత్నించినవి",right:"సరైనవి",wrongLabel:"తప్పులు",skipped:"స్కిప్",again:"మళ్లీ ప్రాక్టీస్",expired:"సమయం అయింది!",correctLabel:"సరైనవి"},
  hi:{intro:"छोटी चुनौतियों से गणना की गति बढ़ाएँ।",solved:"हल किए प्रश्न",accuracy:"सटीकता",streak:"सर्वश्रेष्ठ लगातार सही",choose:"विषय चुनें",free:"100% मुफ़्त",start:"अभ्यास शुरू करें",answer:"आपका उत्तर",ready:"शुरू करने के लिए बटन दबाएँ।",correct:"सही! अगला प्रश्न।",wrong:"सही नहीं। सही उत्तर: ",skip:"अगला प्रश्न →",timeup:"समय समाप्त! परिणाम तैयार हैं।",speedHint:"हर प्रश्न के लिए 10 सेकंड।",minuteHint:"60 सेकंड में अधिक से अधिक हल करें।",sec:"सेकंड",min:"सेकंड",attempted:"प्रयास",right:"सही",wrongLabel:"गलत",skipped:"छोड़े",again:"फिर अभ्यास करें",expired:"समय समाप्त!",correctLabel:"सही"},
  ta:{intro:"சிறிய சவால்கள் மூலம் கணக்கிடும் வேகத்தை வளர்த்திடுங்கள்.",solved:"முடித்த கேள்விகள்",accuracy:"துல்லியம்",streak:"சிறந்த தொடர்",choose:"தலைப்பைத் தேர்ந்தெடுக்கவும்",free:"முற்றிலும் இலவசம்",start:"பயிற்சியைத் தொடங்கு",answer:"உங்கள் பதில்",ready:"தொடங்க பொத்தானை அழுத்தவும்.",correct:"சரி! அடுத்த கேள்வி.",wrong:"தவறு. சரியான பதில்: ",skip:"அடுத்த கேள்வி →",timeup:"நேரம் முடிந்தது! முடிவுகள் தயார்.",speedHint:"ஒவ்வொரு கேள்விக்கும் 10 விநாடிகள்.",minuteHint:"60 விநாடிகளில் முடிந்தவரை தீர்க்கவும்.",sec:"வி.",min:"வி.",attempted:"முயற்சித்தவை",right:"சரி",wrongLabel:"தவறு",skipped:"தவிர்த்தவை",again:"மீண்டும் பயிற்சி",expired:"நேரம் முடிந்தது!",correctLabel:"சரி"},
  kn:{intro:"ಸಣ್ಣ ಸವಾಲುಗಳ ಮೂಲಕ ಲೆಕ್ಕದ ವೇಗ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.",solved:"ಪರಿಹರಿಸಿದ ಪ್ರಶ್ನೆಗಳು",accuracy:"ನಿಖರತೆ",streak:"ಅತ್ಯುತ್ತಮ ಸರಣಿ",choose:"ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ",free:"ಪೂರ್ಣ ಉಚಿತ",start:"ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ",answer:"ನಿಮ್ಮ ಉತ್ತರ",ready:"ಪ್ರಾರಂಭಿಸಲು ಬಟನ್ ಒತ್ತಿ.",correct:"ಸರಿ! ಮುಂದಿನ ಪ್ರಶ್ನೆ.",wrong:"ತಪ್ಪಾಗಿದೆ. ಸರಿಯಾದ ಉತ್ತರ: ",skip:"ಮುಂದಿನ ಪ್ರಶ್ನೆ →",timeup:"ಸಮಯ ಮುಗಿದಿದೆ! ಫಲಿತಾಂಶ ಸಿದ್ಧವಾಗಿದೆ.",speedHint:"ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ 10 ಸೆಕೆಂಡು.",minuteHint:"60 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸಾಧ್ಯವಾದಷ್ಟು ಬಿಡಿಸಿ.",sec:"ಸೆ.",min:"ಸೆ.",attempted:"ಪ್ರಯತ್ನಿಸಿದವು",right:"ಸರಿ",wrongLabel:"ತಪ್ಪು",skipped:"ಬಿಟ್ಟವು",again:"ಮತ್ತೆ ಅಭ್ಯಾಸ",expired:"ಸಮಯ ಮುಗಿದಿದೆ!",correctLabel:"ಸರಿ"},
  ml:{intro:"ചെറിയ ചലഞ്ചുകളിലൂടെ കണക്കുകൂട്ടൽ വേഗം വർധിപ്പിക്കൂ.",solved:"പരിഹരിച്ച ചോദ്യങ്ങൾ",accuracy:"കൃത്യത",streak:"മികച്ച തുടർച്ച",choose:"ഒരു വിഷയം തിരഞ്ഞെടുക്കൂ",free:"പൂർണ്ണമായും സൗജന്യം",start:"പരിശീലനം തുടങ്ങുക",answer:"നിങ്ങളുടെ ഉത്തരം",ready:"തുടങ്ങാൻ ബട്ടൺ അമർത്തൂ.",correct:"ശരി! അടുത്ത ചോദ്യം.",wrong:"ശരിയല്ല. ശരിയായ ഉത്തരം: ",skip:"അടുത്ത ചോദ്യം →",timeup:"സമയം കഴിഞ്ഞു! ഫലങ്ങൾ തയ്യാറാണ്.",speedHint:"ഓരോ ചോദ്യത്തിനും 10 സെക്കൻഡ്.",minuteHint:"60 സെക്കൻഡിൽ കഴിയുന്നത്ര ചെയ്യൂ.",sec:"സെ.",min:"സെ.",attempted:"ശ്രമിച്ചത്",right:"ശരി",wrongLabel:"തെറ്റ്",skipped:"ഒഴിവാക്കിയത്",again:"വീണ്ടും പരിശീലിക്കുക",expired:"സമയം കഴിഞ്ഞു!",correctLabel:"ശരി"},
  bn:{intro:"ছোট ছোট চ্যালেঞ্জে হিসাবের গতি বাড়ান।",solved:"সমাধান করা প্রশ্ন",accuracy:"নির্ভুলতা",streak:"সেরা ধারাবাহিকতা",choose:"বিষয় বেছে নিন",free:"সম্পূর্ণ বিনামূল্যে",start:"অনুশীলন শুরু",answer:"আপনার উত্তর",ready:"শুরু করতে বোতাম চাপুন।",correct:"সঠিক! পরের প্রশ্ন।",wrong:"সঠিক নয়। সঠিক উত্তর: ",skip:"পরের প্রশ্ন →",timeup:"সময় শেষ! ফলাফল প্রস্তুত।",speedHint:"প্রতি প্রশ্নে ১০ সেকেন্ড।",minuteHint:"৬০ সেকেন্ডে যত বেশি পারেন সমাধান করুন।",sec:"সে.",min:"সে.",attempted:"চেষ্টা",right:"সঠিক",wrongLabel:"ভুল",skipped:"এড়িয়ে গেছেন",again:"আবার অনুশীলন",expired:"সময় শেষ!",correctLabel:"সঠিক"},
  mr:{intro:"छोट्या आव्हानांमधून गणनेचा वेग वाढवा.",solved:"सोडवलेले प्रश्न",accuracy:"अचूकता",streak:"सर्वोत्तम सलग उत्तरं",choose:"विषय निवडा",free:"पूर्णपणे मोफत",start:"सराव सुरू करा",answer:"तुमचे उत्तर",ready:"सुरू करण्यासाठी बटण दाबा.",correct:"बरोबर! पुढचा प्रश्न.",wrong:"बरोबर नाही. योग्य उत्तर: ",skip:"पुढचा प्रश्न →",timeup:"वेळ संपली! निकाल तयार आहेत.",speedHint:"प्रत्येक प्रश्नासाठी १० सेकंद.",minuteHint:"६० सेकंदांत शक्य तितके प्रश्न सोडवा.",sec:"से.",min:"से.",attempted:"प्रयत्न",right:"बरोबर",wrongLabel:"चूक",skipped:"वगळले",again:"पुन्हा सराव",expired:"वेळ संपली!",correctLabel:"बरोबर"}
};

const topicNames = {
 addition:"Addition", subtraction:"Subtraction", multiplication:"Multiplication", division:"Division",
 mixed:"Mixed operations", simplification:"Simplification", squares:"Squares", cubes:"Cubes",
 roots:"Square roots", percentages:"Percentages", algebra:"Algebra formulas",
 trigonometry:"Trigonometry", alphabet:"Alphabet values", reverse:"Reverse alphabet"
};

function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function setFeedback(message,kind=""){const el=$("feedback");el.textContent=message;el.className="feedback "+kind;}
function getQuestion(){
 let a,b,c,op,answer,question;
 switch(state.topic){
  case "addition": a=rand(12,999);b=rand(11,999);answer=a+b;question=`${a} + ${b} = ?`;break;
  case "subtraction": a=rand(30,999);b=rand(1,a);answer=a-b;question=`${a} − ${b} = ?`;break;
  case "multiplication": a=rand(3,35);b=rand(2,19);answer=a*b;question=`${a} × ${b} = ?`;break;
  case "division": b=rand(2,15);c=rand(2,25);a=b*c;answer=c;question=`${a} ÷ ${b} = ?`;break;
  case "mixed": {const ops=["+","−","×","÷"];op=ops[rand(0,3)];if(op==="+"){a=rand(10,150);b=rand(10,150);answer=a+b;}else if(op==="−"){a=rand(30,200);b=rand(1,a);answer=a-b;}else if(op==="×"){a=rand(3,25);b=rand(2,12);answer=a*b;}else{b=rand(2,12);answer=rand(2,20);a=b*answer;}question=`${a} ${op} ${b} = ?`;break;}
  case "simplification": {const n=rand(2,15),m=rand(2,12),p=rand(2,9);const pattern=rand(0,2);if(pattern===0){answer=n+m*p;question=`${n} + ${m} × ${p} = ?`;}else if(pattern===1){answer=(n+m)*p;question=`(${n} + ${m}) × ${p} = ?`;}else{answer=n*p-m;question=`${n} × ${p} − ${m} = ?`;}break;}
  case "squares": a=rand(2,40);answer=a*a;question=`${a}² = ?`;break;
  case "cubes": a=rand(2,15);answer=a*a*a;question=`${a}³ = ?`;break;
  case "roots": a=rand(2,35);answer=a;question=`√${a*a} = ?`;break;
  case "percentages": {const pct=[5,10,12.5,20,25,30,40,50,75][rand(0,8)];a=rand(2,20)*10;answer=a*pct/100;question=`${pct}% of ${a} = ?`;break;}
  case "algebra": {const forms=[{q:"(a + b)² = a² + 2ab + ?",a:"b²"},{q:"(a − b)² = a² − 2ab + ?",a:"b²"},{q:"a² − b² = (a − b)(a + ?)",a:"b"},{q:"(a + b)(a − b) = ?",a:"a² − b²"},{q:"a³ + b³ = (a + b)(a² − ab + ?)",a:"b²"}];const f=forms[rand(0,forms.length-1)];question=f.q;answer=f.a;break;}
  case "trigonometry": {const vals=[["sin 0°","0"],["sin 30°","1/2"],["sin 90°","1"],["cos 0°","1"],["cos 60°","1/2"],["cos 90°","0"],["tan 45°","1"],["tan 0°","0"],["tan 30°","1/√3"]];const f=vals[rand(0,vals.length-1)];question=`${f[0]} = ?`;answer=f[1];break;}
  case "alphabet": a=rand(1,26);answer=String.fromCharCode(64+a);question=`${a} = which letter?`;break;
  case "reverse": a=rand(1,26);answer=String.fromCharCode(91-a);question=`${a} = which letter? (Z = 1)`;break;
  default: a=rand(10,99);b=rand(10,99);answer=a+b;question=`${a} + ${b} = ?`;
 }
 state.answer=answer;state.questionsShown++;$("question").textContent=question;$("answer").value="";$("answer").placeholder=translations[state.language].answer;
 $("answer").inputMode=(state.topic==="alphabet"||state.topic==="reverse"||state.topic==="algebra"||state.topic==="trigonometry")?"text":"decimal";
}
function attempted(){return state.correct+state.wrong;}
function updateSession(){
 $("sessionCorrect").textContent=state.correct;$("sessionWrong").textContent=state.wrong;
 $("sessionSkipped").textContent=state.skipped;$("sessionAttempted").textContent=attempted();
 $("solved").textContent=Number(localStorage.getItem("mb_solved")||0);
 $("accuracy").textContent=attempted()?Math.round(state.correct/attempted()*100)+"%":"—";
 $("streak").textContent=state.bestStreak;
}
function setMode(mode){
 if(state.running) stopSession(false);
 state.mode=mode;document.querySelectorAll(".mode-btn").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
 $("timer").textContent=mode==="speed"?"10":"60";
 $("modeHint").textContent=translations[state.language][mode==="speed"?"speedHint":"minuteHint"];
 $("challengeLabel").textContent=mode==="speed"?"10-SECOND SPRINT":"ONE-MINUTE CHALLENGE";
 resetSession();
}
function resetSession(){
 stopClock();state.running=false;state.correct=0;state.wrong=0;state.skipped=0;state.streak=0;state.bestStreak=0;state.locked=false;
 state.timeLeft=state.mode==="speed"?10:60;$("timer").textContent=state.timeLeft;
 $("submit").textContent=translations[state.language].start;$("submit").disabled=false;
 $("resultCard").hidden=true;$("practiceCard").hidden=false;setFeedback(translations[state.language].ready);
 getQuestion();updateSession();
}
function startClock(){
 stopClock();state.running=true;state.timeLeft=state.mode==="speed"?10:60;$("timer").textContent=state.timeLeft;
 state.clock=setInterval(()=>{
  state.timeLeft--;$("timer").textContent=state.timeLeft;
  if(state.timeLeft<=0){
   if(state.mode==="speed"){state.skipped++;updateSession();getQuestion();state.timeLeft=10;$("timer").textContent=10;setFeedback("Time expired — question skipped.");}
   else finishSession();
  }
 },1000);
}
function stopClock(){if(state.clock){clearInterval(state.clock);state.clock=null;}}
function stopSession(showResults=true){
 stopClock();state.running=false;$("submit").disabled=false;
 if(showResults) showResultsCard();
}
function showResultsCard(){
 $("practiceCard").hidden=true;$("resultCard").hidden=false;
 const total=attempted(),accuracy=total?Math.round(state.correct/total*100):0;
 $("resultAttempted").textContent=total;$("resultCorrect").textContent=state.correct;
 $("resultWrong").textContent=state.wrong;$("resultSkipped").textContent=state.skipped;
 $("resultAccuracy").textContent=accuracy+"%";
 const rate=state.mode==="minute"?state.correct:Math.round(state.correct*60/Math.max(1,state.questionsShown*10));
 $("resultRate").textContent=rate;
 const key=`mb_best_${state.mode}_${state.topic}`;
 const old=Number(localStorage.getItem(key)||0),best=Math.max(old,state.correct);
 localStorage.setItem(key,String(best));$("personalBest").textContent=best;
}
function finishSession(){stopSession(true);setFeedback(translations[state.language].timeup);}
function nextQuestion(){getQuestion();if(state.mode==="speed"){state.timeLeft=10;$("timer").textContent=10;}setFeedback("");}
function submitAnswer(value){
 if(!state.running){startClock();$("submit").textContent="Submit answer";$("answer").focus();return;}
 if(state.locked)return;
 const raw=String(value).trim();if(!raw)return;
 const expected=String(state.answer).toLowerCase().replace(/\s/g,"");
 const actual=raw.toLowerCase().replace(/\s/g,"");
 if(actual===expected){
  state.correct++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);
  const old=Number(localStorage.getItem("mb_solved")||0);localStorage.setItem("mb_solved",String(old+1));
  setFeedback(translations[state.language].correct,"good");updateSession();
  if(state.mode==="speed"){nextQuestion();}else getQuestion();
 }else{
  state.wrong++;state.streak=0;setFeedback(translations[state.language].wrong+state.answer,"bad");updateSession();
  if(state.mode==="speed"){nextQuestion();}else getQuestion();
 }
}
$("answerForm").addEventListener("submit",e=>{e.preventDefault();submitAnswer($("answer").value);});
$("skip").addEventListener("click",()=>{if(!state.running){setFeedback("Press Start practice first.");return;}state.skipped++;updateSession();nextQuestion();});
$("restart").addEventListener("click",resetSession);
$("playAgain").addEventListener("click",resetSession);
$("topics").addEventListener("click",e=>{
 const btn=e.target.closest("button[data-topic]");if(!btn)return;
 state.topic=btn.dataset.topic;document.querySelectorAll(".topic").forEach(x=>x.classList.toggle("selected",x===btn));resetSession();
});
document.querySelectorAll(".mode-btn").forEach(btn=>btn.addEventListener("click",()=>setMode(btn.dataset.mode)));
$("language").addEventListener("change",()=>{
 state.language=$("language").value;const t=translations[state.language];document.documentElement.lang=state.language;
 $("intro").textContent=t.intro;$("stat1label").textContent=t.solved;$("stat2label").textContent=t.accuracy;$("stat3label").textContent=t.streak;
 $("chooseTopic").textContent=t.choose;$("freeTag").textContent=t.free;$("answer").placeholder=t.answer;
 $("submit").textContent=t.start;$("skip").textContent=t.skip;$("modeHint").textContent=t[state.mode==="speed"?"speedHint":"minuteHint"];
 $("timer").textContent=state.timeLeft;$("footerNote").textContent="Made for learners. Free practice, wherever you are.";
});
getQuestion();updateSession();