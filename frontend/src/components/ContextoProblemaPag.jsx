import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Schema de validação Zod baseado no JSON Schema fornecido
const etapa1Schema = z.object({
  nomeProduto: z.string().min(1, "Nome do produto é obrigatório"),
  descricaoIdeia: z.string().min(1, "Descrição da ideia é obrigatória").max(2000),
  problemaCentral: z.string().min(1, "Problema central é obrigatório").max(1500),
  publicoAlvo: z.string().min(1, "Público alvo é obrigatório").max(1000),
  stakeholders: z.array(z.string()).default([]),
  motivacao: z.string().min(1, "Motivação é obrigatória").max(1500),
  evidencias: z.string().max(2000).optional(),
  hipotesesPrincipais: z.array(z.string()).default([]),
  jobsToBeDone: z.array(
    z.object({
      quando: z.string(),
      quero: z.string(),
      paraQue: z.string(),
    })
  ).default([]),
  cenarioAtual: z.string().max(2000).optional(),
  concorrentes: z.array(
    z.object({
      nome: z.string(),
      tipo: z.string(),
      forcas: z.string(),
      fraquezas: z.string(),
    })
  ).default([]),
  kpisIniciais: z.array(z.string()).default([]),
  kpisNumericos: z.string().optional(),
  "5whys": z.array(z.string()).max(5).default([]),
  anotacoesExtras: z.string().max(2000).optional(),
  diferenciais: z.string().optional(),
  riscosRestricoes: z.string().optional(),
});

const ContextoProblemaPag = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentoGerado, setDocumentoGerado] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const form = useForm({
    resolver: zodResolver(etapa1Schema),
    defaultValues: {
      nomeProduto: "",
      descricaoIdeia: "",
      problemaCentral: "",
      publicoAlvo: "",
      stakeholders: [],
      motivacao: "",
      evidencias: "",
      hipotesesPrincipais: [],
      jobsToBeDone: [],
      cenarioAtual: "",
      concorrentes: [],
      kpisIniciais: [],
      kpisNumericos: "",
      "5whys": [],
      anotacoesExtras: "",
      diferenciais: "",
      riscosRestricoes: "",
    },
  });

  const {
    fields: stakeholderFields,
    append: appendStakeholder,
    remove: removeStakeholder,
  } = useFieldArray({
    control: form.control,
    name: "stakeholders",
  });

  const {
    fields: hipoteseFields,
    append: appendHipotese,
    remove: removeHipotese,
  } = useFieldArray({
    control: form.control,
    name: "hipotesesPrincipais",
  });

  const {
    fields: jtbdFields,
    append: appendJTBD,
    remove: removeJTBD,
  } = useFieldArray({
    control: form.control,
    name: "jobsToBeDone",
  });

  const {
    fields: concorrenteFields,
    append: appendConcorrente,
    remove: removeConcorrente,
  } = useFieldArray({
    control: form.control,
    name: "concorrentes",
  });

  const {
    fields: whyFields,
    append: appendWhy,
    remove: removeWhy,
  } = useFieldArray({
    control: form.control,
    name: "5whys",
  });

  // KPIs disponíveis
  const kpisDisponiveis = [
    "Retenção",
    "NPS",
    "CSAT",
    "Conversão",
    "Redução de custos",
    "Tempo médio no processo",
  ];

  const [kpisOutro, setKpisOutro] = useState(false);
  const [kpisOutroValor, setKpisOutroValor] = useState("");

  // Carregar rascunho do localStorage
  useEffect(() => {
    const rascunho = localStorage.getItem("etapa1-rascunho");
    if (rascunho) {
      try {
        const dados = JSON.parse(rascunho);
        form.reset(dados);
        toast.info("Rascunho carregado");
      } catch (e) {
        console.error("Erro ao carregar rascunho:", e);
      }
    }
  }, []);

  // Salvar rascunho automaticamente
  const salvarRascunho = () => {
    const dados = form.getValues();
    localStorage.setItem("etapa1-rascunho", JSON.stringify(dados));
    toast.success("Rascunho salvo automaticamente");
  };

  // Auto-save a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(salvarRascunho, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return ["pdf", "png", "jpg", "jpeg", "txt"].includes(ext);
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} arquivo(s) adicionado(s)`);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsProcessing(true);

    try {
      // 1. Salvar input no backend
      const inputResponse = await fetch("/api/etapas/1/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!inputResponse.ok) throw new Error("Erro ao salvar input");

      const inputData = await inputResponse.json();

      // 2. Processar com multiagente
      const processResponse = await fetch("/api/etapas/1/processar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputId: inputData.id }),
      });

      if (!processResponse.ok) throw new Error("Erro ao processar documento");

      const documento = await processResponse.json();
      setDocumentoGerado(documento);

      toast.success("Documento gerado com sucesso!");
      localStorage.removeItem("etapa1-rascunho");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao processar formulário: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportarPDF = async () => {
    if (!documentoGerado) return;

    try {
      const response = await fetch(`/api/etapas/1/documento/${documentoGerado.id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `etapa1-contexto-problema-${documentoGerado.id}.pdf`;
      a.click();
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF");
    }
  };

  const copiarMarkdown = () => {
    if (!documentoGerado?.markdown) return;

    navigator.clipboard.writeText(documentoGerado.markdown);
    toast.success("Markdown copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Etapa 1 — Contexto & Problema
              </h1>
              <p className="text-gray-600">
                Identificação inicial do problema e da oportunidade de mercado
              </p>
            </div>
          </div>
        </div>

        {!documentoGerado ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={["info-gerais"]} className="space-y-4">
                {/* 1) Informações Gerais */}
                <AccordionItem value="info-gerais">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">1. Informações Gerais</CardTitle>
                        <CardDescription>
                          Dados básicos sobre o produto e a motivação
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="nomeProduto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Produto *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex.: GenesiX, SuperApp, etc."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="descricaoIdeia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição da Ideia *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva sua ideia de produto em detalhes..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 2000 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motivacao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Motivação *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Por que você quer criar este produto? Qual a sua motivação pessoal ou profissional?"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 1500 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 2) Problema & Público */}
                <AccordionItem value="problema-publico">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">2. Problema & Público</CardTitle>
                        <CardDescription>
                          Definição do problema central e público-alvo
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="problemaCentral"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Problema Central *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Qual é o problema principal que seu produto resolve?"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 1500 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publicoAlvo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Público Alvo *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Quem são as pessoas ou empresas que enfrentam este problema?"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 1000 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 3) Stakeholders */}
                <AccordionItem value="stakeholders">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">3. Stakeholders</CardTitle>
                        <CardDescription>
                          Partes interessadas no projeto
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        {stakeholderFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`stakeholders.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="Ex.: Usuários finais, Investidores, Equipe técnica..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeStakeholder(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendStakeholder("")}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Stakeholder
                        </Button>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 4) Evidências */}
                <AccordionItem value="evidencias">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">4. Evidências</CardTitle>
                        <CardDescription>
                          Dados e evidências que comprovam o problema
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="evidencias"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evidências</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Dados, pesquisas, estatísticas, feedbacks que comprovam a existência do problema..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 2000 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 5) Hipóteses Principais */}
                <AccordionItem value="hipoteses">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">5. Hipóteses Principais</CardTitle>
                        <CardDescription>
                          Suas principais suposições sobre a solução
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        {hipoteseFields.map((field, index) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <FormField
                              control={form.control}
                              name={`hipotesesPrincipais.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder="Ex.: Acreditamos que usuários pagariam por uma solução que..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeHipotese(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendHipotese("")}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Hipótese
                        </Button>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 6) KPIs Iniciais */}
                <AccordionItem value="kpis">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">6. KPIs Iniciais</CardTitle>
                        <CardDescription>
                          Métricas que você deseja acompanhar
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="kpisIniciais"
                          render={() => (
                            <FormItem>
                              <FormLabel>Selecione os KPIs</FormLabel>
                              {kpisDisponiveis.map((kpi) => (
                                <FormField
                                  key={kpi}
                                  control={form.control}
                                  name="kpisIniciais"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(kpi)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, kpi])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== kpi)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{kpi}</FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={kpisOutro}
                                  onCheckedChange={setKpisOutro}
                                />
                                <Label>Outro</Label>
                              </div>
                              {kpisOutro && (
                                <Input
                                  placeholder="Especifique outro KPI..."
                                  value={kpisOutroValor}
                                  onChange={(e) => {
                                    setKpisOutroValor(e.target.value);
                                    const current = form.getValues("kpisIniciais");
                                    if (e.target.value && !current.includes(e.target.value)) {
                                      form.setValue("kpisIniciais", [...current, e.target.value]);
                                    }
                                  }}
                                />
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="kpisNumericos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resultados Numéricos Desejados</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex.: reduzir 30% do tempo do processo..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 7) Contexto de Negócio & Mercado */}
                <AccordionItem value="contexto-mercado">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">
                          7. Contexto de Negócio & Mercado
                        </CardTitle>
                        <CardDescription>
                          Cenário atual, concorrentes e diferenciais
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-4">
                        <FormField
                          control={form.control}
                          name="cenarioAtual"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cenário Atual</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva o cenário atual do mercado..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 2000 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <Label>Concorrentes / Alternativas</Label>
                          {concorrenteFields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-gray-50">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">
                                    Concorrente {index + 1}
                                  </h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeConcorrente(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`concorrentes.${index}.nome`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Nome do concorrente" {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`concorrentes.${index}.tipo`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Tipo</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex.: Direto, Indireto, Substituto"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`concorrentes.${index}.forcas`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Forças</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Principais pontos fortes..."
                                          rows={2}
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`concorrentes.${index}.fraquezas`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Fraquezas</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Principais pontos fracos..."
                                          rows={2}
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </Card>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              appendConcorrente({
                                nome: "",
                                tipo: "",
                                forcas: "",
                                fraquezas: "",
                              })
                            }
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Concorrente
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name="diferenciais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diferenciais Percebidos</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="O que diferencia seu produto dos concorrentes?"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 8) Informações Avançadas */}
                <AccordionItem value="info-avancadas">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">8. Informações Avançadas</CardTitle>
                        <CardDescription>
                          JTBD, 5 Whys, uploads e restrições
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6 space-y-6">
                        {/* Job-to-be-Done */}
                        <div className="space-y-4">
                          <Label>Job-to-be-Done (JTBD)</Label>
                          <p className="text-sm text-gray-600">
                            Quando [situação], quero [motivação], para [resultado esperado]
                          </p>
                          {jtbdFields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-gray-50">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">JTBD {index + 1}</h4>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeJTBD(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`jobsToBeDone.${index}.quando`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Quando (situação)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex.: estou planejando uma viagem"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`jobsToBeDone.${index}.quero`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Quero (motivação)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex.: encontrar as melhores opções de hospedagem"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`jobsToBeDone.${index}.paraQue`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Para que (resultado esperado)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Ex.: economizar tempo e dinheiro"
                                          {...field}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </Card>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              appendJTBD({ quando: "", quero: "", paraQue: "" })
                            }
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar JTBD
                          </Button>
                        </div>

                        {/* 5 Whys */}
                        <div className="space-y-4">
                          <Label>5 Whys (Análise de Causa Raiz)</Label>
                          <p className="text-sm text-gray-600">
                            Pergunte "por quê?" até 5 vezes para chegar à causa raiz
                          </p>
                          {whyFields.map((field, index) => (
                            <div key={field.id} className="flex items-center space-x-2">
                              <span className="text-sm font-semibold w-16">
                                Why {index + 1}:
                              </span>
                              <FormField
                                control={form.control}
                                name={`5whys.${index}`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder={`Por quê ${index > 0 ? "isso acontece" : "o problema existe"}?`}
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeWhy(index)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                          {whyFields.length < 5 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => appendWhy("")}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar Why
                            </Button>
                          )}
                        </div>

                        {/* Upload de Artefatos */}
                        <div className="space-y-4">
                          <Label>Upload de Artefatos</Label>
                          <p className="text-sm text-gray-600">
                            Formatos aceitos: PDF, PNG, JPG, TXT
                          </p>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              accept=".pdf,.png,.jpg,.jpeg,.txt"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="w-12 h-12 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">
                                Clique para fazer upload ou arraste arquivos aqui
                              </span>
                            </label>
                          </div>
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm">{file.name}</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Riscos ou Restrições */}
                        <FormField
                          control={form.control}
                          name="riscosRestricoes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Riscos ou Restrições</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva riscos técnicos, de negócio ou regulatórios..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* 9) Anotações Extras */}
                <AccordionItem value="anotacoes">
                  <Card className="border-2 border-blue-100 shadow-lg">
                    <AccordionTrigger className="px-6 hover:no-underline">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg">9. Anotações Extras</CardTitle>
                        <CardDescription>
                          Informações adicionais relevantes
                        </CardDescription>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-6">
                        <FormField
                          control={form.control}
                          name="anotacoesExtras"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Anotações</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Qualquer informação adicional que você considere relevante..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Máximo 2000 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-6 pb-12">
                <Button
                  type="button"
                  variant="outline"
                  onClick={salvarRascunho}
                  className="px-6"
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando com IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Documento
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          /* Preview do Documento Gerado */
          <Card className="border-2 border-green-500 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <CardTitle className="text-2xl text-green-800">
                      Documento Gerado com Sucesso!
                    </CardTitle>
                    <CardDescription>
                      Etapa 1 — Contexto & Problema
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={copiarMarkdown}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Markdown
                  </Button>
                  <Button
                    onClick={exportarPDF}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button
                    onClick={() => setDocumentoGerado(null)}
                    variant="outline"
                    size="sm"
                  >
                    Editar Formulário
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div
                  className="markdown-preview"
                  dangerouslySetInnerHTML={{ __html: documentoGerado?.htmlPreview }}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContextoProblemaPag;
