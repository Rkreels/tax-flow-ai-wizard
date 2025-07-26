
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Edit, FileText, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface TaxRule {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
}

const TaxRulesPage: React.FC = () => {
  const { speak } = useVoiceAssistant();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    speak("Tax Rules Configuration page loaded. Here you can manage tax deductions, credits, and other regulations.");
  }, [speak]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    category: "deduction"
  });

  // Sample tax rules data
  const [taxRules, setTaxRules] = useState<TaxRule[]>([
    {
      id: "1",
      name: "Standard Deduction 2023",
      description: "Base amount that reduces taxable income for all taxpayers",
      category: "deduction",
      lastUpdated: "2025-01-15"
    },
    {
      id: "2",
      name: "Child Tax Credit",
      description: "Tax credit for taxpayers with qualifying children",
      category: "credit",
      lastUpdated: "2025-02-20"
    },
    {
      id: "3",
      name: "Mortgage Interest Deduction",
      description: "Deduction for interest paid on home mortgages",
      category: "deduction",
      lastUpdated: "2025-03-05"
    }
  ]);

  const handleAddRule = () => {
    const rule = {
      id: `${taxRules.length + 1}`,
      name: newRule.name,
      description: newRule.description,
      category: newRule.category,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTaxRules([...taxRules, rule]);
    setIsAddDialogOpen(false);
    setNewRule({ name: "", description: "", category: "deduction" });
    speak(`Tax rule ${newRule.name} has been added successfully`);
    toast.success("Tax rule added successfully");
  };

  const handleEditRule = () => {
    if (!selectedRule) return;

    const updatedRules = taxRules.map(rule => {
      if (rule.id === selectedRule.id) {
        return { ...selectedRule, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return rule;
    });

    setTaxRules(updatedRules);
    setIsEditDialogOpen(false);
    toast.success("Tax rule updated successfully");
  };

  const handleDeleteRule = () => {
    if (!selectedRule) return;
    
    const updatedRules = taxRules.filter(rule => rule.id !== selectedRule.id);
    setTaxRules(updatedRules);
    setIsDeleteDialogOpen(false);
    toast.success("Tax rule deleted successfully");
  };

  const filteredRules = taxRules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout requiredPermission="manage_tax_rules">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tax Rules</h1>
          <Button onClick={() => {
            speak("Opening new tax rule dialog. Enter the rule name, description, and category.");
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add New Rule
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
          <Input
            type="search"
            placeholder="Search tax rules..."
            className="w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRules.map((rule) => (
            <Card key={rule.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                  {rule.name}
                </CardTitle>
                <CardDescription>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {rule.category.toUpperCase()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-4">{rule.description}</p>
                <p className="text-xs text-muted-foreground">Last updated: {rule.lastUpdated}</p>
              </CardContent>
              <div className="flex justify-end border-t bg-muted/50 p-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRule(rule);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      setSelectedRule(rule);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Rule Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tax Rule</DialogTitle>
              <DialogDescription>
                Create a new tax rule for the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Rule name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Rule description"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select
                  id="category"
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="deduction">Deduction</option>
                  <option value="credit">Credit</option>
                  <option value="income">Income</option>
                  <option value="exemption">Exemption</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRule}>Add Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Rule Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Tax Rule</DialogTitle>
              <DialogDescription>
                Update the tax rule information.
              </DialogDescription>
            </DialogHeader>
            {selectedRule && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input
                    id="edit-name"
                    value={selectedRule.name}
                    onChange={(e) => setSelectedRule({ ...selectedRule, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                  <Input
                    id="edit-description"
                    value={selectedRule.description}
                    onChange={(e) => setSelectedRule({ ...selectedRule, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
                  <select
                    id="edit-category"
                    value={selectedRule.category}
                    onChange={(e) => setSelectedRule({ ...selectedRule, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="deduction">Deduction</option>
                    <option value="credit">Credit</option>
                    <option value="income">Income</option>
                    <option value="exemption">Exemption</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditRule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Tax Rule</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this tax rule? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 py-4">
              <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p>{selectedRule?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedRule?.description}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteRule}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TaxRulesPage;
