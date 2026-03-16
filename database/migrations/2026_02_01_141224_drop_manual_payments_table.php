<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('manual_payments');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Recreate the manual_payments table if needed for rollback
        Schema::create('manual_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id');
            $table->integer('credit_amount');
            $table->string('currency');
            $table->string('transaction_id');
            $table->string('sender_number');
            $table->enum('status', ['pending', 'processing', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'status']);
            $table->index(['currency', 'status']);
            $table->unique(['transaction_id', 'currency']);
        });
    }
};
