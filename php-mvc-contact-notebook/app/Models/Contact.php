<?php

namespace App\Models;

class Contact
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public string $phone
    ) {}
}
