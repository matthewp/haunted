# Guides >> Properties || 21

<style data-helmet>
  html { --playground-ide-height: 210px; }
</style>

If you haven't used lit-html before you're probably wondering what the differences between properties and attributes are. As stated above, attributes can only have string values, this is because all attributes go through [`Element#setAttribute`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute). Properties do not go through `setAttribute`, instead they are properties on the custom element itself. This allows you to pass in any value instead of just strings.

To bind to a property in lit-html, you can use the `.` prefix before the property name:

```js
function Profile({ userData }) {
  return html`
    <section>
      <h2>Profile</h2>
      <article>
        <figure>
          <img src=${userData.portrait} alt="user portait" />
          <figcaption>${userData.name}</figcaption>
        </figure>
        <p>${userData.bio}</p>
      </article>
    </section>
  `;
}

customElements.define('my-profile', component(Profile));

function App() {
  const userData = useFictitiousUser();

  return html`
    <my-profile .userData=${userData}></my-profile>
  `;
}
```

Notice that it is encouraged to use camel case when writing your template instead of kebab case as these aren't attributes. They're properties so they won't be automatically rewritten in camel case for you.
