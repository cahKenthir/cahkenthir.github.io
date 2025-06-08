FROM nginx:1.21-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy SSL certificates
COPY ssl/ /etc/nginx/ssl/

# Create cache directories
RUN mkdir -p /var/cache/nginx/client_temp

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]