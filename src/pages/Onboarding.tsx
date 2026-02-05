 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Globe, Building2, FileText, ArrowRight, Sparkles, Loader2, Zap, Shield, BarChart3 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import logo from "@/assets/logo.png";
 
 export default function Onboarding() {
   const navigate = useNavigate();
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [formData, setFormData] = useState({
     websiteUrl: "",
     businessName: "",
     description: "",
     services: "",
   });
 
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   const handleAnalyze = async () => {
     if (!formData.websiteUrl && !formData.businessName) {
       return;
     }
 
     setIsAnalyzing(true);
     
     // Store the data in localStorage for now
     localStorage.setItem("businessProfile", JSON.stringify(formData));
     localStorage.setItem("onboardingComplete", "true");
     
     // Simulate analysis delay
     await new Promise((resolve) => setTimeout(resolve, 2500));
     
     setIsAnalyzing(false);
     navigate("/dashboard");
   };
 
   const isFormValid = formData.websiteUrl.trim() !== "" || formData.businessName.trim() !== "";
 
   return (
     <div className="min-h-screen bg-navy flex">
       {/* Left Side - Branding */}
       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
         {/* Background gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-electric/20" />
         
         {/* Decorative elements */}
         <div className="absolute top-20 left-20 w-72 h-72 bg-electric/10 rounded-full blur-3xl" />
         <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-electric/5 rounded-full blur-2xl" />
         
         {/* Content */}
         <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
           <img src={logo} alt="Three Reach" className="h-16 w-auto mb-12" />
           
           <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
             Make Your Business
             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-electric to-cyan">
               Discoverable by AI
             </span>
           </h1>
           
           <p className="text-lg text-white/70 mb-12 max-w-md">
             Get found by ChatGPT, Gemini, and Perplexity. We analyze, build, and distribute your AI presence.
           </p>
           
           {/* Features */}
           <div className="space-y-6">
             <div className="flex items-center gap-4">
               <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-electric/20 border border-electric/30">
                 <Zap className="w-6 h-6 text-electric" />
               </div>
               <div>
                 <h3 className="text-white font-semibold">AI Visibility Score</h3>
                 <p className="text-white/60 text-sm">Know exactly how visible you are to AI engines</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan/20 border border-cyan/30">
                 <Shield className="w-6 h-6 text-cyan" />
               </div>
               <div>
                 <h3 className="text-white font-semibold">Proof-Based Tracking</h3>
                 <p className="text-white/60 text-sm">Screenshot evidence of every AI mention</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-electric/20 border border-electric/30">
                 <BarChart3 className="w-6 h-6 text-electric" />
               </div>
               <div>
                 <h3 className="text-white font-semibold">60+ Distribution Sources</h3>
                 <p className="text-white/60 text-sm">Automated submission to knowledge platforms</p>
               </div>
             </div>
           </div>
         </div>
       </div>
       
       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
         <div className="w-full max-w-md">
           {/* Mobile logo */}
           <div className="lg:hidden text-center mb-8">
             <img src={logo} alt="Three Reach" className="h-12 mx-auto mb-4" />
           </div>
           
           {/* Form Header */}
           <div className="mb-8">
             <h2 className="text-2xl font-bold text-foreground mb-2">
               Analyze Your AI Visibility
             </h2>
             <p className="text-muted-foreground">
               Enter your website or business details to get started
             </p>
           </div>
           
           {/* Form */}
           <div className="space-y-5">
             {/* Website URL */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground flex items-center gap-2">
                 <Globe className="h-4 w-4 text-electric" />
                 Website URL
               </label>
               <Input
                 name="websiteUrl"
                 placeholder="https://yourwebsite.com"
                 value={formData.websiteUrl}
                 onChange={handleInputChange}
                 className="h-12 bg-muted/50 border-border/50 focus:border-electric focus:ring-electric/20"
               />
             </div>
 
             {/* Business Name */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground flex items-center gap-2">
                 <Building2 className="h-4 w-4 text-electric" />
                 Business Name
               </label>
               <Input
                 name="businessName"
                 placeholder="Your Company Name"
                 value={formData.businessName}
                 onChange={handleInputChange}
                 className="h-12 bg-muted/50 border-border/50 focus:border-electric focus:ring-electric/20"
               />
             </div>
 
             {/* Description */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground flex items-center gap-2">
                 <FileText className="h-4 w-4 text-electric" />
                 Business Description
               </label>
               <Textarea
                 name="description"
                 placeholder="What does your business do? Describe your products or services..."
                 value={formData.description}
                 onChange={handleInputChange}
                 className="min-h-[100px] resize-none bg-muted/50 border-border/50 focus:border-electric focus:ring-electric/20"
               />
             </div>
 
             {/* Services */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-foreground flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-electric" />
                 Key Services/Products
               </label>
               <Input
                 name="services"
                 placeholder="e.g., Web Development, Marketing, Consulting"
                 value={formData.services}
                 onChange={handleInputChange}
                 className="h-12 bg-muted/50 border-border/50 focus:border-electric focus:ring-electric/20"
               />
             </div>
 
             {/* Analyze Button */}
             <Button
               onClick={handleAnalyze}
               disabled={!isFormValid || isAnalyzing}
               className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-electric to-electric/90 hover:from-electric/90 hover:to-electric text-white shadow-lg shadow-electric/25 transition-all duration-300 hover:shadow-electric/40"
             >
               {isAnalyzing ? (
                 <>
                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                   Analyzing...
                 </>
               ) : (
                 <>
                   Start Analysis
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </>
               )}
             </Button>
           </div>
           
           {/* AI Engines */}
           <div className="mt-10 pt-8 border-t border-border/50">
             <p className="text-sm text-muted-foreground text-center mb-4">
               We'll scan your visibility across
             </p>
             <div className="flex items-center justify-center gap-6">
               <div className="text-center">
                 <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-2 mx-auto">
                   <span className="text-lg font-bold text-foreground">G</span>
                 </div>
                 <span className="text-xs text-muted-foreground">ChatGPT</span>
               </div>
               <div className="text-center">
                 <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-2 mx-auto">
                   <span className="text-lg font-bold text-foreground">G</span>
                 </div>
                 <span className="text-xs text-muted-foreground">Gemini</span>
               </div>
               <div className="text-center">
                 <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-2 mx-auto">
                   <span className="text-lg font-bold text-foreground">P</span>
                 </div>
                 <span className="text-xs text-muted-foreground">Perplexity</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }