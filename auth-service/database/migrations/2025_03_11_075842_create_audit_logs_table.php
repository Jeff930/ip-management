<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('session_id')->nullable();
            $table->string('actor_name')->nullable();
            $table->string('action');
            $table->unsignedBigInteger('target_id')->nullable();
            $table->string('target_type')->nullable();
            $table->json('target')->nullable();
            $table->json('changes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('audit_logs');
    }
};

