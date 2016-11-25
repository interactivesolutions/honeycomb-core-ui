<script>
    $(document).ready(function () {
        $(".search-menu-box").on('input', function() {
            var filter = $(this).val();
            $(".sidebar-menu > li").each(function(){
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        });
    });
</script>