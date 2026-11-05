import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { BeneficiarioFormData, BeneficiarioFormInput } from '../schemas/beneficiarioSchema';

type Props = Omit<TextFieldProps, 'name' | 'error' | 'value' | 'defaultValue'> & {
  name: keyof BeneficiarioFormInput;
  control: Control<BeneficiarioFormInput, unknown, BeneficiarioFormData>;
};

// A aula usa {...register('campo')}, mas aí o TextField não fica sabendo do valor inicial
// e o rótulo pode ficar por cima do texto na edição. O useController deixa o campo controlado.
export function CampoTexto({ name, control, helperText, ...props }: Props) {
  const { field, fieldState } = useController({ name, control });

  return (
    <TextField
      {...props}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      error={fieldState.invalid}
      helperText={fieldState.error?.message ?? helperText}
      fullWidth
      margin="normal"
    />
  );
}
