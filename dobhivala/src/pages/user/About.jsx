// import React from "react";
// import { WashingMachine, Shirt, Truck, Sparkles } from "lucide-react";

// const About = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f9fcff] to-[#d7ecff] py-16 px-6 text-gray-800">
//       <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border">

//         {/* Header */}
//         <h1 className="text-4xl font-bold text-blue-600 mb-3 text-center">
//           About DhobiWala
//         </h1>
//         <p className="text-gray-600 text-center text-lg mb-8">
//           Premium laundry care for your everyday life.
//         </p>

//         {/* Intro */}
//         <p className="text-gray-700 text-lg leading-relaxed mb-6">
//           DhobiWala में आपका स्वागत है!  
//           हम आपकी रोज़मर्रा की कपड़ों की धुलाई को आसान, तेज़ और पूरी तरह 
//           hassle-free बनाने के लिए dedicated हैं।  

//           हमारा विश्वास है कि <span className="font-semibold">“Clean Clothes, Clear Mind”</span>  
//           — इसी सोच के साथ हम हर कपड़े को सबसे अच्छे care के साथ treat करते हैं।
//         </p>

//         {/* Features Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">

//           {/* Washing */}
//           <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border">
//             <WashingMachine className="w-10 h-10 text-blue-600" />
//             <div>
//               <h3 className="text-xl font-semibold text-blue-600">Professional Washing</h3>
//               <p className="text-gray-600 text-sm">
//                 हर कपड़े के लिए अलग washing process—no damage, no shrinkage.
//               </p>
//             </div>
//           </div>

//           {/* Ironing */}
//           <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border">
//             <Shirt className="w-10 h-10 text-green-600" />
//             <div>
//               <h3 className="text-xl font-semibold text-green-600">Premium Ironing</h3>
//               <p className="text-gray-600 text-sm">
//                 Crisp, neat और wrinkle-free finish—bilkul नए जैसे!
//               </p>
//             </div>
//           </div>

//           {/* Pickup & Delivery */}
//           <div class0lassName="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border">
//             <Truck className="w-10 h-10 text-yellow-600" />
//             <div>
//               <h3 className="text-xl font-semibold text-yellow-600">Pickup & Delivery</h3>
//               <p className="text-gray-600 text-sm">
//                 Doorstep से pickup और delivery—आपकी सुविधा हमारी जिम्मेदारी।
//               </p>
//             </div>
//           </div>

//           {/* Hygiene */}
//           <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border">
//             <Sparkles className="w-10 h-10 text-purple-600" />
//             <div>
//               <h3 className="text-xl font-semibold text-purple-600">100% Hygiene</h3>
//               <p className="text-gray-600 text-sm">
//                 Fresh water, separate loads और high-quality detergents used.
//               </p>
//             </div>
//           </div>

//         </div>

//         {/* Closing */}
//         <p className="text-center text-gray-700 mt-10 text-lg">
//           आपकी सुविधा और भरोसा — यही DhobiWala की पहचान है.  
//           हम आपका Laundry Partner बनने के लिए हमेशा तैयार हैं!
//         </p>
//       </div>
//     </div>
//   );
// };

// export default About;


import React from "react";
import {
  WashingMachine,
  Shirt,
  Truck,
  Sparkles,
  ThumbsUp,
  Clock,
  Users,
  Smile,
  PlayCircle,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2f4ff] via-[#f7fbff] to-[#cee7ff] text-gray-800">

      {/* ======================= HERO SECTION ======================= */}
      <div className="relative w-full">
        <img
          src="https://images.pexels.com/photos/5591590/pexels-photo-5591590.jpeg"
          className="w-full h-[300px] sm:h-[380px] object-cover rounded-b-3xl shadow-lg"
          alt="Laundry Hero"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center rounded-b-3xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            Welcome to <span className="text-blue-300">DhobiWala</span>
          </h1>
          <p className="text-white mt-3 max-w-2xl text-lg">
            Fresh Clothes • Fast Service • Perfect Hygiene
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-14 px-5">

        {/* ======================= VIDEO BANNER ======================= */}
        <div className="relative mb-14">
          <img
            src="https://images.pexels.com/photos/4050421/pexels-photo-4050421.jpeg"
            className="w-full rounded-2xl shadow-lg"
            alt="Laundry Video"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <PlayCircle className="w-20 h-20 text-white drop-shadow-2xl hover:scale-110 duration-200 cursor-pointer" />
          </div>
        </div>

        {/* ======================= STORY ======================= */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Our Story
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-10">
          DhobiWala ek simple idea se shuru hua:  
          <span className="font-semibold text-blue-600">
            “Kapde saaf hon, tension half ho.”
          </span>  
          Hum chaahte hain aap apne important kaam karein,  
          aur laundry ham par chhod dein — safe, hygienic aur professional care ke saath.  
          Aaj, humare hazaaron khush customers hain jo hum par bharosa karte hain  
          unke kapdon ki dekhbhaal ke liye, aur hum har din unka vishwas banaye rakhne ke liye committed hain.
        </p>

        {/* ======================= FUNNY JOKE ======================= */}
        <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-xl shadow-md max-w-xl mx-auto mb-14 text-center">
          <Smile className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
          <p className="text-gray-700 font-medium text-lg">
            एक मज़ेदार जोक 🤭  
          </p>
          <p className="text-gray-600 mt-1">
            Customer: *“Bhaiya, kapde kitne time mein aa jayenge?”*<br/> 
            Dhobi: *“Agar machine ne attitude nahi dikhaya to kal tak!”* 😆<br/>
            Customer: *“Wah bhaiya, aapke jokes bhi wash ki tarah fresh hain!”* <br/> 
            Dhobi: *“😂
          </p>
        </div>

        {/* ======================= WHY CHOOSE US ======================= */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Why Choose DhobiWala?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          <FeatureCard
            icon={<WashingMachine className="w-10 h-10 text-blue-600" />}
            title="Professional Washing"
            text="Fabric-friendly wash cycles with premium detergents."
            color="blue"
          />
          <FeatureCard
            icon={<Shirt className="w-10 h-10 text-green-600" />}
            title="Premium Ironing"
            text="Sharp, crisp and perfect finishing for every outfit."
            color="green"
          />
          <FeatureCard
            icon={<Truck className="w-10 h-10 text-yellow-600" />}
            title="Pickup & Delivery"
            text="Doorstep service – fast, reliable and hassle-free."
            color="yellow"
          />
          <FeatureCard
            icon={<Sparkles className="w-10 h-10 text-purple-600" />}
            title="100% Hygiene"
            text="Fresh water, safe chemicals & high-quality cleaning."
            color="purple"
          />
        </div>

        {/* ======================= STATS ======================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          <StatCard
            icon={<Clock className="w-10 h-10 text-blue-600" />}
            number="5+ Years"
            text="Trusted Experience"
          />
          <StatCard
            icon={<Users className="w-10 h-10 text-green-600" />}
            number="10,000+"
            text="Happy Customers"
          />
          <StatCard
            icon={<Sparkles className="w-10 h-10 text-purple-600" />}
            number="1,00,000+"
            text="Clothes Cleaned"
          />
        </div>

        {/* ======================= MISSION + VISION ======================= */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <MissionCard
            title="Our Mission"
            text="Providing fresh, hygienic and affordable laundry service with love and care. Kapde saaf karein, zindagi आसान banayein."
          />
          <MissionCard
            title="Our Vision"
            text="To become India’s most trusted laundry partner, delivering quality and convenience to every home."
          />
        </div>

        {/* ======================= TEAM SECTION ======================= */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Meet Our Team
        </h2>

        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <TeamCard
            img="https://images.pexels.com/photos/936042/pexels-photo-936042.jpeg"
            name="Aman gurjar"
            role="Washing Expert"
          />
          <TeamCard
            img="https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg"
            name="Ritesh choudhary"
            role="Ironing Specialist"
          />
          <TeamCard
            img="https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg"
            name="Ritesh Moond"
            role="Delivery Runner"
          />
        </div>

        <p className="text-center mt-14 text-gray-700 text-lg">
          DhobiWala —  
          <span className="font-semibold text-blue-600">
            Your Clothes, Our Responsibility!
          </span>
        </p>

      </div>
    </div>
  );
};

/* ------------------- COMPONENTS ------------------- */

const FeatureCard = ({ icon, title, text, color }) => (
  <div className={`flex items-start gap-4 p-5 bg-${color}-50 rounded-xl border shadow-sm`}>
    {icon}
    <div>
      <h3 className={`text-xl font-semibold text-${color}-700`}>{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  </div>
);

const StatCard = ({ icon, number, text }) => (
  <div className="bg-white p-6 rounded-2xl border shadow text-center">
    {icon}
    <h3 className="text-2xl font-bold mt-2">{number}</h3>
    <p className="text-gray-600 text-sm">{text}</p>
  </div>
);

const MissionCard = ({ title, text }) => (
  <div className="bg-white p-6 rounded-2xl border shadow">
    <h3 className="text-2xl font-bold text-blue-700 mb-2">{title}</h3>
    <p className="text-gray-700 text-sm">{text}</p>
  </div>
);

const TeamCard = ({ img, name, role }) => (
  <div className="bg-white rounded-2xl border shadow p-4">
    <img
      src={img}
      className="w-full h-48 object-cover rounded-xl mb-3"
      alt={name}
    />
    <h3 className="text-xl font-semibold">{name}</h3>
    <p className="text-gray-600 text-sm">{role}</p>
  </div>
);

export default About;

