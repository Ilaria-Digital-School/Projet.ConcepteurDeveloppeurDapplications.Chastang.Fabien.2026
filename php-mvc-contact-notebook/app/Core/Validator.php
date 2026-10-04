<?php

namespace App\Core;

class Validator
{
    private array $errors = [];

    public function __construct(private array $data) {}

    // Private method to populate the error array
    private function addError(string $field, string $message): void
    {
        if (!isset($this->errors[$field])) $this->errors[$field] = $message;
    }

    // Public methods /////////////////////////////////////////////////////////

    public function required(string $field, ?string $message = null): self
    {
        $value = $this->data[$field] ?? null;

        if (is_null($value) || (is_string($value) && trim($value) === '')) {
            $this->addError(
                $field,
                $message ?? "The field \"$field\" is mandatory."
            );
        }
        return $this;
    }

    public function min(string $field, int $min, ?string $message = null): self
    {
        $value = trim((string) ($this->data[$field] ?? ''));

        if (strlen($value) < $min) {
            $this->addError(
                $field,
                $message ?? "The field \"$field\" must have a minimum of $min characters."
            );
        }
        return $this;
    }

    public function max(string $field, int $max, ?string $message = null): self
    {
        $value = trim((string) ($this->data[$field] ?? ''));

        if (strlen($value) > $max) {
            $this->addError(
                $field,
                $message ?? "The field \"$field\" must have a maximum of $max characters."
            );
        }
        return $this;
    }

    public function email(string $field, ?string $message = null): self
    {
        $value = filter_var(
            trim((string) ($this->data[$field] ?? '')),
            FILTER_VALIDATE_EMAIL
        );

        if (!$value) {
            $this->addError(
                $field,
                $message ?? "The field \"$field\" must be a valid email address."
            );
        }
        return $this;
    }

    public function phone(string $field, ?string $message = null): self
    {
        $value = filter_var(
            trim((string) ($this->data[$field] ?? '')),
            FILTER_VALIDATE_REGEXP,
            ["options" => ["regexp" => "/^(?:[\s)(+.-]*\d+){8,}[\s)(+.-]*$/"]]
        );

        if (!$value) {
            $this->addError(
                $field,
                $message ?? "The field \"$field\" must be a valid phone number."
            );
        }
        return $this;
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
