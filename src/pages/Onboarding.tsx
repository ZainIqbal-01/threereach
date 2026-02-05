 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Globe, Building2, FileText, ArrowRight, Sparkles, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
     navigate("/");
   };
 
   const isFormValid = formData.websiteUrl.trim() !== "" || formData.businessName.trim() !== "";
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center p-8">
       <div className="w-full max-w-2xl">
         {/* Header */}
         <div className="text-center mb-8">
           <img src={logo} alt="Three Reach" className="h-14 mx-auto mb-6" />
           <h1 className="text-3xl font-semibold text-foreground mb-2">
             Let's Analyze Your AI Visibility
           </h1>
           <p className="text-muted-foreground text-lg">
             Enter your website or business details to discover how visible you are to AI engines
           </p>
         </div>
 
         {/* Form Card */}
         <Card className="border-border/50 shadow-lg">
           <CardHeader className="pb-4">
             <CardTitle className="text-xl text-foreground">Business Information</CardTitle>
             <CardDescription>
               Provide your website URL or describe your business for AI visibility analysis
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
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
                 className="h-12"
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
                 className="h-12"
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
                 placeholder="Describe what your business does, your products or services..."
                 value={formData.description}
                 onChange={handleInputChange}
                 className="min-h-[100px] resize-none"
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
                 className="h-12"
               />
             </div>
 
             {/* Analyze Button */}
             <Button
               onClick={handleAnalyze}
               disabled={!isFormValid || isAnalyzing}
               className="w-full h-14 text-lg font-semibold bg-electric hover:bg-electric/90 text-white"
             >
               {isAnalyzing ? (
                 <>
                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                   Analyzing Your AI Visibility...
                 </>
               ) : (
                 <>
                   Analyze My Visibility
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </>
               )}
             </Button>
 
             <p className="text-center text-sm text-muted-foreground">
               We'll scan AI engines like ChatGPT, Gemini, and Perplexity to see if your business is discoverable
             </p>
           </CardContent>
         </Card>
 
         {/* Features */}
         <div className="mt-8 grid grid-cols-3 gap-4 text-center">
           <div className="p-4">
             <div className="text-2xl font-bold text-electric mb-1">ChatGPT</div>
             <p className="text-sm text-muted-foreground">OpenAI's Assistant</p>
           </div>
           <div className="p-4">
             <div className="text-2xl font-bold text-electric mb-1">Gemini</div>
             <p className="text-sm text-muted-foreground">Google's AI</p>
           </div>
           <div className="p-4">
             <div className="text-2xl font-bold text-electric mb-1">Perplexity</div>
             <p className="text-sm text-muted-foreground">AI Search Engine</p>
           </div>
         </div>
       </div>
     </div>
   );
 }