<section class="bg-white rounded-lg shadow-md border border-gray-200">
    <header class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">
            <slot name="title" />
        </h2>    
    
        <slot name="header-actions" />
    </header>


    <!-- Card Body -->
    <div class="px-6 py-4">
       <slot />
    </div>

</section>