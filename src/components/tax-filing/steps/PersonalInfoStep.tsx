
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface PersonalInfoStepProps {
  onNext: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onNext }) => {
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    speak("Personal information step. Please fill in your personal details including name, social security number, date of birth, address, and filing status.");
  }, [speak]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">
          Please provide your personal information for your tax return.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Enter your first name" defaultValue="John" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Enter your last name" defaultValue="Doe" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ssn">Social Security Number</Label>
          <Input id="ssn" placeholder="XXX-XX-XXXX" defaultValue="123-45-6789" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" placeholder="MM/DD/YYYY" defaultValue="01/15/1980" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" placeholder="Enter your occupation" defaultValue="Software Engineer" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" placeholder="(XXX) XXX-XXXX" defaultValue="(555) 123-4567" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Filing Status</Label>
        <RadioGroup defaultValue="single" className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="filing-single" />
              <Label htmlFor="filing-single">Single</Label>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="married-joint" id="filing-married-joint" />
              <Label htmlFor="filing-married-joint">Married Filing Jointly</Label>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="married-separate" id="filing-married-separate" />
              <Label htmlFor="filing-married-separate">Married Filing Separately</Label>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="head" id="filing-head" />
              <Label htmlFor="filing-head">Head of Household</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input id="street" placeholder="Enter street address" defaultValue="123 Main St" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Enter city" defaultValue="San Francisco" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select defaultValue="CA">
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input id="zipCode" placeholder="Enter zip code" defaultValue="94105" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email address" defaultValue="john.doe@example.com" />
        </div>
      </div>

      <div className="pt-4 text-right">
        <Button onClick={onNext}>
          Continue to Income <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
