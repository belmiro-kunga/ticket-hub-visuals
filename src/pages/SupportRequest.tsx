import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketsContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  User, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Send,
  Upload,
  X,
  Info,
  Clock,
  Zap,
  AlertCircle
} from "lucide-react";

interface SupportFormData {
  // Step 1: User Info
  name: string;
  email: string;
  phone: string;
  department: string;
  
  // Step 2: Issue Details
  category: string;
  priority: string;
  subject: string;
  description: string;
  
  // Step 3: Additional Info
  urgency: string;
  affectedUsers: string;
  businessImpact: string;
  attachments: File[];
  
  // Step 4: Review
  agreedToTerms: boolean;
}

const initialFormData: SupportFormData = {
  name: "",
  email: "",
  phone: "",
  department: "",
  category: "",
  priority: "",
  subject: "",
  description: "",
  urgency: "",
  affectedUsers: "",
  businessImpact: "",
  attachments: [],
  agreedToTerms: false
};

const categories = [
  { value: "technical", label: "Problema Técnico", icon: "🔧" },
  { value: "account", label: "Conta e Acesso", icon: "👤" },
  { value: "billing", label: "Faturação", icon: "💰" },
  { value: "feature", label: "Nova Funcionalidade", icon: "✨" },
  { value: "bug", label: "Erro no Sistema", icon: "🐛" },
  { value: "other", label: "Outros", icon: "❓" }
];

const priorities = [
  { 
    value: "low", 
    label: "Baixa", 
    description: "Não urgente, pode aguardar",
    color: "bg-green-100 text-green-800",
    icon: <Clock className="h-4 w-4" />
  },
  { 
    value: "medium", 
    label: "Média", 
    description: "Importante, mas não crítico",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Info className="h-4 w-4" />
  },
  { 
    value: "high", 
    label: "Alta", 
    description: "Precisa de atenção rápida",
    color: "bg-orange-100 text-orange-800",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  { 
    value: "urgent", 
    label: "Urgente", 
    description: "Crítico, precisa de ação imediata",
    color: "bg-red-100 text-red-800",
    icon: <Zap className="h-4 w-4" />
  }
];

const departments = [
  "Tecnologia da Informação",
  "Recursos Humanos", 
  "Financeiro",
  "Vendas",
  "Marketing",
  "Operações",
  "Suporte ao Cliente",
  "Outros"
];

export default function SupportRequest() {
  const { user, isAuthenticated } = useAuth();
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SupportFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof SupportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create ticket using the tickets context
      const newTicketId = createTicket({
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        urgency: formData.urgency,
        affectedUsers: formData.affectedUsers,
        businessImpact: formData.businessImpact,
        attachments: formData.attachments.map(file => file.name)
      });
      
      setTicketId(newTicketId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateFormData('attachments', [...formData.attachments, ...files]);
  };

  const removeFile = (index: number) => {
    const newFiles = formData.attachments.filter((_, i) => i !== index);
    updateFormData('attachments', newFiles);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        // Step 1 is always valid since user data is automatically filled
        return !!(user?.name && user?.email && user?.department);
      case 2:
        return !!(formData.category && formData.priority && formData.subject && formData.description);
      case 3:
        return !!(formData.urgency && formData.affectedUsers);
      case 4:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Solicitação Enviada!</h2>
            <p className="text-muted-foreground mb-4">
              Seu ticket foi criado com sucesso. Você receberá uma confirmação por email em breve.
            </p>
            <Badge variant="outline" className="mb-4">
              Ticket #{ticketId}
            </Badge>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData(initialFormData);
                }}
                className="w-full"
              >
                Nova Solicitação
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/my-tickets')}
                className="w-full"
              >
                Ver Meus Tickets
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Ir para Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logo/Brand */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Ticket Hub</h1>
              <p className="text-xs text-gray-500">Sistema de Suporte</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/my-tickets')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Meus Tickets</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Solicitar Suporte
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha os dados abaixo para criar sua solicitação de suporte
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Passo {currentStep} de {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="w-full" />
            
            <div className="flex justify-between mt-4 text-xs sm:text-sm">
              <span className={currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                Informações
              </span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                Problema
              </span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                Detalhes
              </span>
              <span className={currentStep >= 4 ? "text-primary font-medium" : "text-muted-foreground"}>
                Revisão
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><User className="h-5 w-5" /> Suas Informações</>}
              {currentStep === 2 && <><AlertTriangle className="h-5 w-5" /> Detalhes do Problema</>}
              {currentStep === 3 && <><FileText className="h-5 w-5" /> Informações Adicionais</>}
              {currentStep === 4 && <><CheckCircle className="h-5 w-5" /> Revisão e Envio</>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Precisamos de algumas informações básicas para processar sua solicitação"}
              {currentStep === 2 && "Descreva o problema que você está enfrentando"}
              {currentStep === 3 && "Forneça mais detalhes para nos ajudar a resolver rapidamente"}
              {currentStep === 4 && "Revise todas as informações antes de enviar"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: User Information */}
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    disabled
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    placeholder="seu.email@empresa.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={user?.phone || ''}
                    disabled
                    placeholder="+244 xxx xxx xxx"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <Input
                    value={user?.department || ''}
                    disabled
                    placeholder="Seu departamento"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Issue Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Categoria do Problema *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.category === category.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData('category', category.value)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Prioridade *</Label>
                  <RadioGroup 
                    value={formData.priority} 
                    onValueChange={(value) => updateFormData('priority', value)}
                    className="space-y-3"
                  >
                    {priorities.map((priority) => (
                      <div key={priority.value} className="flex items-center space-x-3 border rounded-lg p-3">
                        <RadioGroupItem value={priority.value} id={priority.value} />
                        <div className="flex items-center space-x-2 flex-1">
                          {priority.icon}
                          <div>
                            <Label htmlFor={priority.value} className="font-medium cursor-pointer">
                              {priority.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{priority.description}</p>
                          </div>
                        </div>
                        <Badge className={priority.color}>{priority.label}</Badge>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => updateFormData('subject', e.target.value)}
                    placeholder="Resumo breve do problema"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Descreva o problema em detalhes, incluindo passos para reproduzir, mensagens de erro, etc."
                    rows={5}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Urgência *</Label>
                  <RadioGroup 
                    value={formData.urgency} 
                    onValueChange={(value) => updateFormData('urgency', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="can-wait" id="can-wait" />
                      <Label htmlFor="can-wait">Posso aguardar - Não há pressa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="soon" id="soon" />
                      <Label htmlFor="soon">Em breve - Preciso de uma solução nos próximos dias</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asap" id="asap" />
                      <Label htmlFor="asap">O mais rápido possível - Está afetando meu trabalho</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical">Crítico - Sistema parado, preciso de ajuda imediata</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affectedUsers">Quantos usuários são afetados? *</Label>
                  <Select value={formData.affectedUsers} onValueChange={(value) => updateFormData('affectedUsers', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o número de usuários afetados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="just-me">Apenas eu</SelectItem>
                      <SelectItem value="few">Poucos usuários (2-5)</SelectItem>
                      <SelectItem value="some">Alguns usuários (6-20)</SelectItem>
                      <SelectItem value="many">Muitos usuários (21-50)</SelectItem>
                      <SelectItem value="all">Todos os usuários (50+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessImpact">Impacto no Negócio</Label>
                  <Textarea
                    id="businessImpact"
                    value={formData.businessImpact}
                    onChange={(e) => updateFormData('businessImpact', e.target.value)}
                    placeholder="Como este problema está afetando suas atividades ou o negócio?"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Anexos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Selecionar Arquivos
                    </Button>
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Arquivos Anexados:</Label>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Informações Pessoais</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nome:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Telefone:</strong> {formData.phone || 'Não informado'}</p>
                      <p><strong>Departamento:</strong> {formData.department}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Detalhes do Problema</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Categoria:</strong> {categories.find(c => c.value === formData.category)?.label}</p>
                      <p><strong>Prioridade:</strong> {priorities.find(p => p.value === formData.priority)?.label}</p>
                      <p><strong>Urgência:</strong> {formData.urgency}</p>
                      <p><strong>Usuários Afetados:</strong> {formData.affectedUsers}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Assunto</h3>
                  <p className="text-sm bg-muted p-3 rounded">{formData.subject}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{formData.description}</p>
                </div>

                {formData.businessImpact && (
                  <div>
                    <h3 className="font-semibold mb-2">Impacto no Negócio</h3>
                    <p className="text-sm bg-muted p-3 rounded">{formData.businessImpact}</p>
                  </div>
                )}

                {formData.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Anexos ({formData.attachments.length})</h3>
                    <div className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <p key={index} className="text-sm text-muted-foreground">• {file.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => updateFormData('agreedToTerms', checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Concordo que as informações fornecidas são verdadeiras e autorizo o processamento destes dados para resolução do meu problema.
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid(currentStep) || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
