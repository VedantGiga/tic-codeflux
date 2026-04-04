import { useSettingsStore, Language } from "@/store/settingsStore";

type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
  en: {
    // Language Screen
    language_title: "Choose your language",
    language_subtitle: "Which language would you like to use?",
    continue: "Continue",
    
    // Onboarding Screen 1
    ob1_title: "Never Miss\nMedicines Again",
    ob1_sub: "CareDose AI sends smart reminders and AI-powered voice calls to ensure your loved ones take their medicines on time — every time.",
    // Onboarding Screen 2
    ob2_title: "AI Calls Your\nLoved Ones",
    ob2_sub: "Our intelligent voice assistant calls patients in their preferred language — Hindi, English, Tamil and more — confirming medicine intake.",
    // Onboarding Screen 3
    ob3_title: "Track Health\nRemotely",
    ob3_sub: "Monitor adherence, view detailed logs, and get instant alerts when a dose is missed. Family care made simple.",
    // Onboarding Screen 4
    ob4_title: "Scan Prescriptions\nInstantly",
    ob4_sub: "Point your camera at any prescription and our AI will automatically extract medicines, dosages, and schedules for you.",
    
    get_started: "Get Started",
    skip: "Skip",
  },
  hi: {
    language_title: "अपनी भाषा चुनें",
    language_subtitle: "आप किस भाषा का उपयोग करना चाहेंगे?",
    continue: "आगे बढ़ें",

    ob1_title: "फिर कभी दवा\nलेना न भूलें",
    ob1_sub: "केयरडोज़ (CareDose) एआई यह सुनिश्चित करता है कि आपके प्रियजन अपनी दवाएँ हमेशा समय पर लें।",
    ob2_title: "एआई आपके\nपरिजनों को कॉल करता है",
    ob2_sub: "हमारा स्मार्ट वॉइस असिस्टेंट मरीज़ों को उनकी पसंदीदा भाषा में कॉल करके दवा लेने की पुष्टि करता है।",
    ob3_title: "स्वास्थ्य की निगरानी\nदूर से करें",
    ob3_sub: "दवाओं के अनुपालन को ट्रैक करें और दवा छूट जाने पर अलर्ट प्राप्त करें। पारिवारिक देखभाल अब आसान।",
    ob4_title: "पर्चे को तुरंत स्कैन करें",
    ob4_sub: "अपने कैमरे को किसी भी डॉक्टर के पर्चे पर इंगित करें और हमारा एआई स्वतः ही शेड्यूल निकाल लेगा।",
    
    get_started: "शुरू करें",
    skip: "छोड़ें",
  },
  mr: {
    language_title: "तुमची भाषा निवडा",
    language_subtitle: "तुम्हाला कोणती भाषा वापरायला आवडेल?",
    continue: "पुढे जा",

    ob1_title: "कधीही औषधे\nविसरणार नाही",
    ob1_sub: "तुमच्या प्रियजनांनी वेळेवर औषधे घेतल्याचे सुनिश्चित करण्यासाठी CareDose AI स्मार्ट रिमाइंडर्स पाठवते.",
    ob2_title: "AI तुमच्या\nपरिजनांना कॉल करेल",
    ob2_sub: "आमचा अतिहुशार व्हॉइस असिस्टंट रुग्णांना त्यांच्या आवडत्या भाषेत कॉल करून औषध घेतल्याची खात्री करतो.",
    ob3_title: "आरोग्यावर दुरुन\nलक्ष ठेवा",
    ob3_sub: "औषध चुकल्यास त्वरित अलर्ट मिळवा. कुटुंबाची काळजी घेणे आता सोपे झाले आहे.",
    ob4_title: "तुमचे प्रिस्क्रिप्शन\nझटपट स्कॅन करा",
    ob4_sub: "कॅमेरा समोर प्रिस्क्रिप्शन धरा आणि आमचा AI आपोआप औषधांची माहिती आणि वेळेचे वेळापत्रक काढून देईल.",
    
    get_started: "सुरुवात करा",
    skip: "सोडून द्या",
  }
};

export function useTranslation() {
  const language = useSettingsStore((s) => s.language) || "en";
  
  const t = (key: string): string => {
    return dictionaries[language][key] || dictionaries["en"][key] || key;
  };

  return { t, language };
}
