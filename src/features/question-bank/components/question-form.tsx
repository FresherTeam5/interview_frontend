import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import CommonSelect from '@/components/common-select'
import MultiSelect, { type MultiSelectOption } from '@/components/multi-select'
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
  MAX_TECH_SELECTION,
} from '@/constants/question'
import { TECHNOLOGY_TYPE_LABELS, TECHNOLOGY_TYPE_ORDER } from '@/constants/technology'
import type {
  QuestionLevel,
  QuestionType,
  QuestionDifficulty,
  TechStackOption,
} from '@/types/question'
import type { TechnologyOption } from '@/types/technology'

export interface QuestionFormValues {
  contentVi: string
  contentEn: string
  techStackIds: number[]
  technologyIds: number[]
  level: QuestionLevel
  questionType: QuestionType
  difficulty: QuestionDifficulty
  companyRef: string
  active: boolean
  version?: number
}

interface QuestionFormProps {
  formId: string
  initialValues?: QuestionFormValues
  /** Tech stack/technology đang gắn với câu hỏi, kể cả bản đã bị vô hiệu hóa. */
  initialTechStacks?: TechStackOption[]
  initialTechnologies?: TechnologyOption[]
  fieldErrors?: Record<string, string>
  isSubmitting?: boolean
  onSubmit: (values: QuestionFormValues) => void
  onDirtyChange?: (dirty: boolean) => void
}

/** Gộp option đang hoạt động với option đã vô hiệu mà câu hỏi vẫn đang gắn. */
function mergeOptions<T extends { id: number }>(active: T[], attached: T[]): T[] {
  const merged = [...active]
  attached.forEach((item) => {
    if (!merged.some((option) => option.id === item.id)) merged.push(item)
  })
  return merged
}

function validate(values: QuestionFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!values.contentVi.trim()) {
    errors.contentVi = 'Nội dung tiếng Việt là bắt buộc.'
  }

  if (values.questionType === 'TECHNICAL' && values.techStackIds.length === 0) {
    errors.techStackIds = 'Chọn ít nhất 1 Tech Stack cho câu hỏi kỹ thuật.'
  } else if (values.techStackIds.length > MAX_TECH_SELECTION) {
    errors.techStackIds = `Tối đa ${MAX_TECH_SELECTION} Tech Stack.`
  }

  if (values.technologyIds.length > MAX_TECH_SELECTION) {
    errors.technologyIds = `Tối đa ${MAX_TECH_SELECTION} công nghệ.`
  }

  if (values.companyRef.trim().length > COMPANY_REF_MAX_LENGTH) {
    errors.companyRef = `Tối đa ${COMPANY_REF_MAX_LENGTH} ký tự.`
  }

  return errors
}

export default function QuestionForm({
  formId,
  initialValues,
  initialTechStacks = [],
  initialTechnologies = [],
  fieldErrors = {},
  isSubmitting = false,
  onSubmit,
  onDirtyChange,
}: QuestionFormProps) {
  // Snapshot lúc mount để so sánh dirty; form được remount qua `key` khi đổi câu hỏi.
  const [initial] = useState<QuestionFormValues>(
    () => initialValues ?? { ...CREATE_QUESTION_DEFAULTS },
  )
  const [values, setValues] = useState<QuestionFormValues>(initial)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const { data: techStacks = [], isLoading: techStacksLoading } = useTechStacks()
  const { data: technologies = [], isLoading: technologiesLoading } = useTechnologies(true)

  const techStackOptions = useMemo<MultiSelectOption<number>[]>(
    () =>
      mergeOptions(techStacks, initialTechStacks).map((item) => ({
        value: item.id,
        label: item.nameVi,
        keywords: [item.code, item.nameEn],
        note: item.active ? undefined : 'đã vô hiệu',
        disabled: !item.active,
      })),
    [techStacks, initialTechStacks],
  )

  const technologyOptions = useMemo<MultiSelectOption<number>[]>(
    () =>
      mergeOptions(technologies, initialTechnologies).map((item) => ({
        value: item.id,
        label: item.nameVi,
        group: TECHNOLOGY_TYPE_LABELS[item.type],
        keywords: [item.code, item.nameEn],
        note: item.active ? undefined : 'đã vô hiệu',
        disabled: !item.active,
      })),
    [technologies, initialTechnologies],
  )

  const technologyGroupOrder = useMemo(
    () => TECHNOLOGY_TYPE_ORDER.map((type) => TECHNOLOGY_TYPE_LABELS[type]),
    [],
  )

  function updateField<K extends keyof QuestionFormValues>(
    key: K,
    value: QuestionFormValues[K],
  ) {
    const next = { ...values, [key]: value }
    setValues(next)
    onDirtyChange?.(JSON.stringify(next) !== JSON.stringify(initial))

    setLocalErrors((prev) => {
      if (!(key in prev)) return prev
      const rest = { ...prev }
      delete rest[key]
      return rest
    })
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const errors = validate(values)
    setLocalErrors(errors)
    if (Object.keys(errors).length > 0) return
    onSubmit(values)
  }

  const errors = { ...localErrors, ...fieldErrors }
  const techStackRequired = values.questionType === 'TECHNICAL'

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.contentVi}>
          <FieldLabel htmlFor="contentVi">
            Nội dung tiếng Việt <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="contentVi"
            value={values.contentVi}
            onChange={(e) => updateField('contentVi', e.target.value)}
            placeholder="Nhập nội dung câu hỏi..."
            rows={4}
            disabled={isSubmitting}
            aria-invalid={!!errors.contentVi}
          />
          <FieldError>{errors.contentVi}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="contentEn">Nội dung tiếng Anh</FieldLabel>
          <Textarea
            id="contentEn"
            value={values.contentEn}
            onChange={(e) => updateField('contentEn', e.target.value)}
            placeholder="(Tùy chọn) English version..."
            rows={3}
            disabled={isSubmitting}
          />
          <FieldDescription>
            Để trống nếu chưa có bản dịch, có thể bổ sung sau.
          </FieldDescription>
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="questionType">
              Loại câu hỏi <span className="text-destructive">*</span>
            </FieldLabel>
            <CommonSelect
              id="questionType"
              value={values.questionType}
              onValueChange={(value) => updateField('questionType', value as QuestionType)}
              disabled={isSubmitting}
              options={QUESTION_TYPES.map((type) => ({
                value: type,
                label: QUESTION_TYPE_LABELS[type],
              }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="level">
              Cấp độ <span className="text-destructive">*</span>
            </FieldLabel>
            <CommonSelect
              id="level"
              value={values.level}
              onValueChange={(value) => updateField('level', value as QuestionLevel)}
              disabled={isSubmitting}
              options={QUESTION_LEVELS.map((level) => ({
                value: level,
                label: LEVEL_LABELS[level],
              }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="difficulty">
              Độ khó <span className="text-destructive">*</span>
            </FieldLabel>
            <CommonSelect
              id="difficulty"
              value={values.difficulty}
              onValueChange={(value) => updateField('difficulty', value as QuestionDifficulty)}
              disabled={isSubmitting}
              options={QUESTION_DIFFICULTIES.map((difficulty) => ({
                value: difficulty,
                label: DIFFICULTY_LABELS[difficulty],
              }))}
            />
          </Field>
        </div>

        <Field data-invalid={!!errors.techStackIds}>
          <FieldLabel htmlFor="techStackIds">
            Tech Stack {techStackRequired && <span className="text-destructive">*</span>}
          </FieldLabel>
          <MultiSelect
            id="techStackIds"
            options={techStackOptions}
            value={values.techStackIds}
            onChange={(value) => updateField('techStackIds', value)}
            disabled={isSubmitting}
            loading={techStacksLoading}
            invalid={!!errors.techStackIds}
            placeholder="Chọn tech stack..."
            searchPlaceholder="Tìm tech stack..."
            emptyText="Không có tech stack nào."
            maxVisible={6}
          />
          {errors.techStackIds ? (
            <FieldError>{errors.techStackIds}</FieldError>
          ) : (
            <FieldDescription>
              {techStackRequired
                ? 'Câu hỏi kỹ thuật cần ít nhất 1 tech stack.'
                : 'Không bắt buộc với câu hỏi hành vi / tình huống.'}
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.technologyIds}>
          <FieldLabel htmlFor="technologyIds">Công nghệ</FieldLabel>
          <MultiSelect
            id="technologyIds"
            options={technologyOptions}
            value={values.technologyIds}
            onChange={(value) => updateField('technologyIds', value)}
            disabled={isSubmitting}
            loading={technologiesLoading}
            invalid={!!errors.technologyIds}
            groupOrder={technologyGroupOrder}
            placeholder="Chọn công nghệ..."
            searchPlaceholder="Tìm công nghệ..."
            emptyText="Không có công nghệ nào khớp."
            maxVisible={6}
          />
          <FieldError>{errors.technologyIds}</FieldError>
        </Field>

        <Field data-invalid={!!errors.companyRef}>
          <FieldLabel htmlFor="companyRef">Công ty / nguồn tham khảo</FieldLabel>
          <Input
            id="companyRef"
            value={values.companyRef}
            onChange={(e) => updateField('companyRef', e.target.value)}
            placeholder="(Tùy chọn) VD: FPT Software"
            maxLength={COMPANY_REF_MAX_LENGTH}
            disabled={isSubmitting}
            aria-invalid={!!errors.companyRef}
          />
          <div className="flex items-start justify-between gap-2">
            <FieldError>{errors.companyRef}</FieldError>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {values.companyRef.trim().length}/{COMPANY_REF_MAX_LENGTH}
            </span>
          </div>
        </Field>

        <Field orientation="horizontal" className="rounded-lg border p-3">
          <FieldContent>
            <FieldLabel htmlFor="active">Đang hoạt động</FieldLabel>
            <FieldDescription>
              {values.active
                ? 'Câu hỏi được dùng cho các phiên phỏng vấn mới.'
                : 'Câu hỏi bị ẩn khỏi các phiên phỏng vấn mới.'}
            </FieldDescription>
          </FieldContent>
          <Switch
            id="active"
            checked={values.active}
            onCheckedChange={(checked) => updateField('active', checked)}
            disabled={isSubmitting}
          />
        </Field>
      </FieldGroup>
    </form>
  )
}
