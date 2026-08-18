import { useState, useMemo } from 'react'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import CommonSelect from '@/components/common-select'
import { useTechStacks } from '@/hooks/use-tech-stacks'
import { useTechnologies } from '@/hooks/use-technologies'
import {
  LEVEL_LABELS,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LABELS,
  QUESTION_LEVELS,
  QUESTION_TYPES,
  QUESTION_DIFFICULTIES,
  CREATE_QUESTION_DEFAULTS,
  COMPANY_REF_MAX_LENGTH,
} from '@/constants/question'
import type {
  QuestionLevel,
  QuestionType as QType,
  QuestionDifficulty,
  TechStackOption,
} from '@/types/question'
import type { TechnologyOption, TechnologyType } from '@/types/technology'

export interface QuestionFormValues {
  contentVi: string
  contentEn: string
  techStackIds: number[]
  technologyIds: number[]
  level: QuestionLevel
  questionType: QType
  difficulty: QuestionDifficulty
  companyRef: string
  active: boolean
  version?: number
}

interface QuestionFormProps {
  mode: 'create' | 'edit'
  initialValues?: QuestionFormValues
  initialTechStacks?: TechStackOption[]
  initialTechnologies?: TechnologyOption[]
  fieldErrors?: Record<string, string>
  isSubmitting?: boolean
  onSubmit: (values: QuestionFormValues) => void
  onCancel: () => void
}

const TECHNOLOGY_TYPE_LABELS: Record<TechnologyType, string> = {
  LANGUAGE: 'Ngôn ngữ',
  FRAMEWORK: 'Framework',
  DATABASE: 'Cơ sở dữ liệu',
  CLOUD: 'Cloud',
  PLATFORM: 'Nền tảng',
  TOOL: 'Công cụ',
}

const TECHNOLOGY_TYPE_ORDER: TechnologyType[] = [
  'LANGUAGE',
  'FRAMEWORK',
  'DATABASE',
  'CLOUD',
  'PLATFORM',
  'TOOL',
]

export default function QuestionForm({
  mode,
  initialValues,
  initialTechStacks = [],
  initialTechnologies = [],
  fieldErrors = {},
  isSubmitting = false,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [values, setValues] = useState<QuestionFormValues>(
    initialValues ?? { ...CREATE_QUESTION_DEFAULTS },
  )
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  const [techSearch, setTechSearch] = useState('')

  const { data: techStacks = [], isLoading: techStacksLoading } = useTechStacks()
  const { data: technologies = [], isLoading: technologiesLoading } = useTechnologies(true)

  // Build tech stack options, including inactive ones if editing
  const techStackOptions = useMemo(() => {
    const options = [...techStacks]
    if (mode === 'edit') {
      initialTechStacks.forEach((ts) => {
        if (!options.some((opt) => opt.id === ts.id)) {
          options.push(ts)
        }
      })
    }
    return options
  }, [mode, techStacks, initialTechStacks])

  // Build technology options, including inactive ones if editing
  const technologyOptions = useMemo(() => {
    const options = [...technologies]
    if (mode === 'edit') {
      initialTechnologies.forEach((tech) => {
        if (!options.some((opt) => opt.id === tech.id)) {
          options.push(tech)
        }
      })
    }
    return options
  }, [mode, technologies, initialTechnologies])

  // Filter and group technologies
  const groupedTechnologies = useMemo(() => {
    const keyword = techSearch.toLowerCase().trim()
    const filtered = technologyOptions.filter(
      (t) =>
        t.nameVi.toLowerCase().includes(keyword) ||
        t.nameEn.toLowerCase().includes(keyword) ||
        t.code.toLowerCase().includes(keyword)
    )

    const groups: Partial<Record<TechnologyType, TechnologyOption[]>> = {}
    filtered.forEach((tech) => {
      if (!groups[tech.type]) groups[tech.type] = []
      groups[tech.type]!.push(tech)
    })
    return groups
  }, [technologyOptions, techSearch])

  function updateField<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    // Clear error for this field
    if (localErrors[key]) {
      setLocalErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function handleTechStackToggle(id: number, checked: boolean) {
    const newIds = checked
      ? [...values.techStackIds, id]
      : values.techStackIds.filter((tid) => tid !== id)
    updateField('techStackIds', newIds)
  }

  function handleTechnologyToggle(id: number, checked: boolean) {
    const newIds = checked
      ? [...values.technologyIds, id]
      : values.technologyIds.filter((tid) => tid !== id)
    updateField('technologyIds', newIds)
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}

    if (!values.contentVi.trim()) {
      errors.contentVi = 'Nội dung tiếng Việt là bắt buộc.'
    }

    if (values.questionType === 'TECHNICAL' && values.techStackIds.length === 0) {
      errors.techStackIds = 'Chọn ít nhất 1 Tech Stack cho câu hỏi kỹ thuật.'
    }

    if (values.techStackIds.length > 20) {
      errors.techStackIds = 'Tối đa 20 Tech Stack.'
    }

    if (values.technologyIds.length > 20) {
      errors.technologyIds = 'Tối đa 20 Technology.'
    }

    if (values.companyRef.trim().length > COMPANY_REF_MAX_LENGTH) {
      errors.companyRef = `Tối đa ${COMPANY_REF_MAX_LENGTH} ký tự.`
    }

    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(values)
  }

  const allErrors = { ...localErrors, ...fieldErrors }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nội dung tiếng Việt */}
      <div className="space-y-2">
        <Label htmlFor="contentVi">
          Nội dung tiếng Việt <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contentVi"
          value={values.contentVi}
          onChange={(e) => updateField('contentVi', e.target.value)}
          placeholder="Nhập nội dung câu hỏi..."
          rows={4}
          disabled={isSubmitting}
          aria-invalid={!!allErrors.contentVi}
          aria-describedby={allErrors.contentVi ? 'err-contentVi' : undefined}
        />
        {allErrors.contentVi && (
          <p id="err-contentVi" className="text-sm text-destructive">{allErrors.contentVi}</p>
        )}
      </div>

      {/* Nội dung tiếng Anh */}
      <div className="space-y-2">
        <Label htmlFor="contentEn">Nội dung tiếng Anh</Label>
        <Textarea
          id="contentEn"
          value={values.contentEn}
          onChange={(e) => updateField('contentEn', e.target.value)}
          placeholder="(Tùy chọn) English version..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Row: questionType */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="questionType">
            Loại câu hỏi <span className="text-destructive">*</span>
          </Label>
          <CommonSelect
            id="questionType"
            value={values.questionType}
            onValueChange={(v) => updateField('questionType', v as QType)}
            disabled={isSubmitting}
            options={QUESTION_TYPES.map((t) => ({ value: t, label: QUESTION_TYPE_LABELS[t] }))}
          />
        </div>
        <div className="space-y-2">
           <Label htmlFor="level">
             Cấp độ <span className="text-destructive">*</span>
           </Label>
           <CommonSelect
             id="level"
             value={values.level}
             onValueChange={(v) => updateField('level', v as QuestionLevel)}
             disabled={isSubmitting}
             options={QUESTION_LEVELS.map((l) => ({ value: l, label: LEVEL_LABELS[l] }))}
           />
         </div>
      </div>

      {/* Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">
            Độ khó <span className="text-destructive">*</span>
          </Label>
          <CommonSelect
            id="difficulty"
            value={values.difficulty}
            onValueChange={(v) => updateField('difficulty', v as QuestionDifficulty)}
            disabled={isSubmitting}
            options={QUESTION_DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] }))}
          />
        </div>
      </div>

      {/* Tech Stacks */}
      <div className="space-y-2">
        <Label>
          Tech Stack
          {values.questionType === 'TECHNICAL' && <span className="text-destructive"> *</span>}
        </Label>
        <div className="rounded-md border p-4">
          {techStacksLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải Tech Stack...</p>
          ) : techStackOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có Tech Stack nào.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {techStackOptions.map((ts) => (
                <div key={ts.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`techStack-${ts.id}`}
                    checked={values.techStackIds.includes(ts.id)}
                    onCheckedChange={(checked) => handleTechStackToggle(ts.id, checked)}
                    disabled={isSubmitting || (!ts.active && !values.techStackIds.includes(ts.id))}
                  />
                  <Label
                    htmlFor={`techStack-${ts.id}`}
                    className={`text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      !ts.active ? 'text-muted-foreground' : ''
                    }`}
                  >
                    {ts.nameVi} {!ts.active && '(đã vô hiệu)'}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        {allErrors.techStackIds && (
          <p className="text-sm text-destructive">{allErrors.techStackIds}</p>
        )}
      </div>

      {/* Technologies */}
      <div className="space-y-2">
        <Label>Technology</Label>
        <div className="rounded-md border p-4 flex flex-col gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công nghệ..."
              className="pl-8"
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
            />
          </div>
          
          {technologiesLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải Technology...</p>
          ) : Object.keys(groupedTechnologies).length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có công nghệ nào khớp.</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
              {TECHNOLOGY_TYPE_ORDER.map((type) => {
                const group = groupedTechnologies[type]
                if (!group || group.length === 0) return null

                return (
                  <div key={type} className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground/80 border-b pb-1">
                      {TECHNOLOGY_TYPE_LABELS[type]}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {group.map((tech) => (
                        <div key={tech.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`technology-${tech.id}`}
                            checked={values.technologyIds.includes(tech.id)}
                            onCheckedChange={(checked) => handleTechnologyToggle(tech.id, checked)}
                            disabled={isSubmitting || (!tech.active && !values.technologyIds.includes(tech.id))}
                          />
                          <Label
                            htmlFor={`technology-${tech.id}`}
                            className={`text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              !tech.active ? 'text-muted-foreground' : ''
                            }`}
                          >
                            {tech.nameVi} {!tech.active && '(đã vô hiệu)'}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {allErrors.technologyIds && (
          <p className="text-sm text-destructive">{allErrors.technologyIds}</p>
        )}
      </div>

      {/* Company reference */}
      <div className="space-y-2">
        <Label htmlFor="companyRef">Công ty / nguồn tham khảo</Label>
        <Input
          id="companyRef"
          value={values.companyRef}
          onChange={(e) => updateField('companyRef', e.target.value)}
          placeholder="(Tùy chọn)"
          maxLength={COMPANY_REF_MAX_LENGTH + 10}
          disabled={isSubmitting}
        />
        <div className="flex justify-between">
          {allErrors.companyRef ? (
            <p className="text-sm text-destructive">{allErrors.companyRef}</p>
          ) : <span />}
          <p className="text-xs text-muted-foreground">
            {values.companyRef.trim().length}/{COMPANY_REF_MAX_LENGTH}
          </p>
        </div>
      </div>

      {/* Active switch */}
      <div className="flex items-center gap-3">
        <Switch
          id="active"
          checked={values.active}
          onCheckedChange={(checked) => updateField('active', checked)}
          disabled={isSubmitting}
        />
        <Label htmlFor="active" className="cursor-pointer">
          Đang hoạt động
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Tạo câu hỏi' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  )
}
